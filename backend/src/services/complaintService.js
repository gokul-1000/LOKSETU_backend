import { prisma, generateComplaintId } from '../utils/db.js'
import { orchestrateComplaint } from './aiService.js'

export const complaintService = {
  /**
   * Create a complaint using AI assistance
   */
  async createWithAI(citizenId, title, description, language = 'English') {
    try {
      // Use new Gemini AI service for orchestration
      const aiResponse = await orchestrateComplaint(title, description, language)
      const analysis = aiResponse.analysis || aiResponse
      
      // Map AI response to database fields
      const complaintId = await generateComplaintId()
      
      // Use ward and zone from AI response (now includes location mapping)
      const zone = analysis.zone || 'Central'
      const ward = analysis.ward || 'General'
      
      console.log('✅ Creating complaint with AI data:', { 
        title: analysis.extractedTitle,
        category: analysis.category,
        department: analysis.department,
        urgency: analysis.urgency,
        ward: ward,
        zone: zone,
        locality: analysis.locality
      })
      
      // Create complaint in database with AI-extracted data
      const complaint = await prisma.complaint.create({
        data: {
          complaintId,
          title: analysis.extractedTitle || title,
          description: description,
          category: analysis.category || 'OTHER',
          location: analysis.location || 'Delhi',
          ward: ward,
          zone: zone,
          citizenId,
          
          // AI Classification
          aiSummary: analysis.summary,
          sentiment: analysis.sentiment || 'COMPLAINT',
          sentimentScore: parseFloat(analysis.sentimentScore) || 0.5,
          aiClassified: true,
          
          // Department recommendation
          department: analysis.department || 'MCD',
          confidence: parseFloat(analysis.sentimentScore) * 100 || 50,
          reason: `Auto-classified as ${analysis.category} with sentiment: ${analysis.sentiment}`,
          sla: this.calculateSLA(analysis.priority),
          
          // Priority & Urgency
          urgency: parseInt(analysis.urgency) || 5,
          priority: analysis.priority || 'MEDIUM',
          
          status: 'OPEN',
          incidentDate: new Date(),
        }
      })
      
      // Log activity
      await prisma.activity.create({
        data: {
          userId: citizenId,
          complaintId: complaint.id,
          action: 'created_complaint',
          description: `Complaint created via AI: ${analysis.extractedTitle}`,
        }
      })
      
      console.log('✅ Complaint created:', complaintId)
      return complaint
    } catch (error) {
      console.error('❌ Error creating complaint with AI:', error.message)
      throw error
    }
  },
  
  calculateSLA(priority) {
    const slaMap = {
      'CRITICAL': '2 hours',
      'HIGH': '24 hours',
      'MEDIUM': '48 hours',
      'LOW': '7 days'
    }
    return slaMap[priority] || '48 hours'
  },

  /**
   * Create a manual complaint without AI
   */
  async createManual(citizenId, data) {
    try {
      const complaintId = await generateComplaintId()
      
      const complaint = await prisma.complaint.create({
        data: {
          complaintId,
          title: data.title,
          description: data.description,
          category: data.category || 'Other',
          location: data.location || '',
          ward: data.ward || 'Unknown',
          zone: data.zone || 'Central',
          citizenId,
          status: 'OPEN',
          priority: 'MEDIUM',
          urgency: 5,
          incidentDate: data.incidentDate ? new Date(data.incidentDate) : new Date(),
        }
      })
      
      await prisma.activity.create({
        data: {
          userId: citizenId,
          complaintId: complaint.id,
          action: 'created_complaint',
          description: `Manual complaint created: ${data.title}`,
        }
      })
      
      return complaint
    } catch (error) {
      console.error('Error creating manual complaint:', error)
      throw error
    }
  },

  /**
   * Get complaint by ID
   */
  async getById(complaintId) {
    return prisma.complaint.findUnique({
      where: { id: complaintId },
      include: {
        citizen: { select: { name: true, email: true, phone: true } },
        updates: { orderBy: { createdAt: 'desc' } },
        activities: { orderBy: { createdAt: 'desc' } },
      }
    })
  },

  /**
   * Get all complaints with filtering & pagination
   */
  async getAll(filters = {}) {
    const {
      status,
      priority,
      department,
      zone,
      ward,
      citizenId,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters

    const where = {}
    if (status) where.status = status
    if (priority) where.priority = priority
    if (department) where.department = department
    if (zone) where.zone = zone
    if (ward) where.ward = ward
    if (citizenId) where.citizenId = citizenId

    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          citizen: { select: { name: true, email: true } },
          updates: { take: 1, orderBy: { createdAt: 'desc' } },
        }
      }),
      prisma.complaint.count({ where })
    ])

    return {
      data: complaints,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    }
  },

  /**
   * Update complaint status
   */
  async updateStatus(complaintId, newStatus, updatedBy) {
    const complaint = await prisma.complaint.update({
      where: { id: complaintId },
      data: {
        status: newStatus,
        ...(newStatus === 'RESOLVED' && { resolvedAt: new Date() })
      }
    })

    await prisma.update.create({
      data: {
        complaintId,
        type: 'STATUS_CHANGE',
        message: `Status changed to ${newStatus}`,
        createdBy: updatedBy,
      }
    })

    return complaint
  },

  /**
   * Add comment/update to complaint
   */
  async addUpdate(complaintId, type, message, createdBy) {
    return prisma.update.create({
      data: {
        complaintId,
        type,
        message,
        createdBy,
      }
    })
  },

  /**
   * Assign complaint to an officer
   */
  async assign(complaintId, officerId, createdBy) {
    const complaint = await prisma.complaint.update({
      where: { id: complaintId },
      data: { assignedTo: officerId }
    })

    await prisma.update.create({
      data: {
        complaintId,
        type: 'ASSIGNMENT',
        message: `Assigned to officer`,
        createdBy,
      }
    })

    return complaint
  },

  getPriorityFromUrgency(urgency) {
    if (urgency >= 8) return 'CRITICAL'
    if (urgency >= 6) return 'HIGH'
    if (urgency >= 4) return 'MEDIUM'
    return 'LOW'
  }
}
