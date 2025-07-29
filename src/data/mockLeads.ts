import { Lead } from "@/components/leads/LeadCard";

export const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Ana García",
    email: "ana.garcia@email.com",
    phone: "+34 691 234 567",
    status: "calificado",
    lastContact: "Hace 2 días",
    tags: ["premium", "urgente"],
    comments: [
      {
        id: "1-1",
        text: "Primera llamada realizada. Muy interesada en el producto premium.",
        author: "Carlos Vendor",
        timestamp: "25/01/2024, 14:30"
      },
      {
        id: "1-2", 
        text: "Envié propuesta por email. Tiene presupuesto aprobado para Q1.",
        author: "Ana García",
        timestamp: "26/01/2024, 09:15"
      }
    ],
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b9211ae9?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@email.com",
    phone: "+34 692 345 678",
    status: "propuesta",
    lastContact: "Hace 1 día",
    tags: ["startup", "demo"],
    comments: [
      {
        id: "2-1",
        text: "CEO de startup tech. Necesita implementación rápida para su equipo.",
        author: "María Sales",
        timestamp: "27/01/2024, 11:20"
      }
    ],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "3",
    name: "María López",
    email: "maria.lopez@email.com", 
    phone: "+34 693 456 789",
    status: "contactado",
    lastContact: "Hace 3 días",
    tags: ["empresa", "demo"],
    comments: [
      {
        id: "3-1",
        text: "Primera llamada exitosa. Solicitó demo personalizada.",
        author: "Pedro Manager",
        timestamp: "24/01/2024, 16:45"
      }
    ]
  },
  {
    id: "4",
    name: "David Martín",
    email: "david.martin@email.com",
    phone: "+34 694 567 890",
    status: "nuevo",
    lastContact: "Hace 1 semana",
    tags: ["empresa"]
  },
  {
    id: "5",
    name: "Laura Fernández",
    email: "laura.fernandez@email.com",
    phone: "+34 695 678 901",
    status: "cerrado",
    lastContact: "Hace 2 semanas",
    tags: ["premium", "presupuesto"],
    comments: [
      {
        id: "5-1",
        text: "¡Cliente convertido! Firmó contrato anual. Proceso de venta exitoso.",
        author: "Ana García",
        timestamp: "15/01/2024, 12:00"
      }
    ],
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "6",
    name: "Sergio Morales",
    email: "sergio.morales@email.com",
    phone: "+34 696 789 012",
    status: "perdido",
    lastContact: "Hace 1 mes",
    tags: ["presupuesto"],
    comments: [
      {
        id: "6-1",
        text: "Decidió ir con competencia por precio. Mantener para futuras oportunidades.",
        author: "Luis Support",
        timestamp: "20/12/2023, 17:30"
      }
    ]
  },
  {
    id: "7",
    name: "Elena Ramírez",
    email: "elena.ramirez@email.com",
    phone: "+34 697 890 123",
    status: "calificado",
    lastContact: "Hace 4 días",
    tags: ["premium", "corporativo"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "8",
    name: "Miguel Santos",
    email: "miguel.santos@email.com",
    phone: "+34 698 901 234",
    status: "contactado",
    lastContact: "Hace 5 días",
    tags: ["startup", "crecimiento"]
  },
  {
    id: "9",
    name: "Carmen Vega",
    email: "carmen.vega@email.com",
    phone: "+34 699 012 345",
    status: "propuesta",
    lastContact: "Hace 1 día",
    tags: ["empresa", "urgente", "demo"],
    avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "10",
    name: "Roberto Jiménez",
    email: "roberto.jimenez@email.com",
    phone: "+34 600 123 456",
    status: "nuevo",
    lastContact: "Hace 3 días",
    tags: ["presupuesto"]
  },
  {
    id: "11",
    name: "Patricia Ruiz",
    email: "patricia.ruiz@email.com",
    phone: "+34 601 234 567",
    status: "cerrado",
    lastContact: "Hace 1 semana",
    tags: ["premium", "corporativo", "multi-año"],
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "12",
    name: "Francisco Herrera",
    email: "francisco.herrera@email.com",
    phone: "+34 602 345 678",
    status: "contactado",
    lastContact: "Hace 6 días",
    tags: ["startup", "tech"]
  },
  {
    id: "13",
    name: "Rocío Delgado",
    email: "rocio.delgado@email.com",
    phone: "+34 603 456 789",
    status: "calificado",
    lastContact: "Hace 2 días",
    tags: ["empresa", "demo", "presupuesto"],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "14",
    name: "Javier Moreno",
    email: "javier.moreno@email.com",
    phone: "+34 604 567 890",
    status: "perdido",
    lastContact: "Hace 3 semanas",
    tags: ["presupuesto", "competencia"]
  },
  {
    id: "15",
    name: "Beatriz Castro",
    email: "beatriz.castro@email.com",
    phone: "+34 605 678 901",
    status: "propuesta",
    lastContact: "Hace 2 días",
    tags: ["premium", "urgente"],
    avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "16",
    name: "Antonio Iglesias",
    email: "antonio.iglesias@email.com",
    phone: "+34 606 789 012",
    status: "nuevo",
    lastContact: "Hace 4 días",
    tags: ["empresa"]
  },
  {
    id: "17",
    name: "Silvia Méndez",
    email: "silvia.mendez@email.com",
    phone: "+34 607 890 123",
    status: "contactado",
    lastContact: "Hace 1 semana",
    tags: ["startup", "demo", "crecimiento"],
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "18",
    name: "Diego Romero",
    email: "diego.romero@email.com",
    phone: "+34 608 901 234",
    status: "calificado",
    lastContact: "Hace 3 días",
    tags: ["corporativo", "multi-departamento"]
  },
  {
    id: "19",
    name: "Nuria Guerrero",
    email: "nuria.guerrero@email.com",
    phone: "+34 609 012 345",
    status: "cerrado",
    lastContact: "Hace 5 días",
    tags: ["premium", "presupuesto", "anual"],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "20",
    name: "Álvaro Peña",
    email: "alvaro.pena@email.com",
    phone: "+34 610 123 456",
    status: "propuesta",
    lastContact: "Hace 1 día",
    tags: ["empresa", "urgente", "demo"]
  },
  {
    id: "21",
    name: "Cristina Vargas",
    email: "cristina.vargas@email.com",
    phone: "+34 611 234 567",
    status: "contactado",
    lastContact: "Hace 2 días",
    tags: ["startup", "tech", "innovación"],
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b9211ae9?w=150&h=150&fit=crop&crop=face"
  }
];