import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PLANTS = [
  // ── Mesa de Otay ──────────────────────────────────────────────────────
  { name: 'Samsung Electronics México', sector: 'Electrónico', lat: 32.5273, lng: -116.9198, address: 'Parque Industrial Mesa de Otay, Tijuana, BC', employees: 3500, potential: 4, status: 'prospecto' },
  { name: 'Medtronic de México', sector: 'Médico', lat: 32.5311, lng: -116.9212, address: 'Mesa de Otay, Tijuana, BC', employees: 1800, potential: 5, status: 'prospecto' },
  { name: 'Abbott Laboratories', sector: 'Médico', lat: 32.5289, lng: -116.9187, address: 'Mesa de Otay, Tijuana, BC', employees: 1200, potential: 5, status: 'prospecto' },
  { name: 'BD Medical (Becton Dickinson)', sector: 'Médico', lat: 32.5302, lng: -116.9201, address: 'Mesa de Otay, Tijuana, BC', employees: 900, potential: 5, status: 'prospecto' },
  { name: 'Plantronics (Poly)', sector: 'Electrónico', lat: 32.5268, lng: -116.9187, address: 'Mesa de Otay, Tijuana, BC', employees: 800, potential: 3, status: 'prospecto' },
  { name: 'Panasonic México', sector: 'Electrónico', lat: 32.5245, lng: -116.9225, address: 'Mesa de Otay, Tijuana, BC', employees: 1100, potential: 4, status: 'prospecto' },
  { name: 'TE Connectivity', sector: 'Electrónico', lat: 32.5285, lng: -116.9218, address: 'Mesa de Otay, Tijuana, BC', employees: 1600, potential: 4, status: 'prospecto' },
  { name: 'L3Harris Technologies', sector: 'Aeroespacial', lat: 32.5318, lng: -116.9175, address: 'Mesa de Otay, Tijuana, BC', employees: 600, potential: 4, status: 'prospecto' },
  { name: 'Sanyo North America', sector: 'Electrónico', lat: 32.5257, lng: -116.9202, address: 'Mesa de Otay, Tijuana, BC', employees: 950, potential: 3, status: 'prospecto' },
  { name: 'GE Healthcare', sector: 'Médico', lat: 32.5307, lng: -116.9179, address: 'Mesa de Otay, Tijuana, BC', employees: 1400, potential: 5, status: 'prospecto' },
  { name: 'WMS Industries', sector: 'Electrónico', lat: 32.5276, lng: -116.9193, address: 'Mesa de Otay, Tijuana, BC', employees: 450, potential: 2, status: 'prospecto' },
  { name: 'Prolec GE (GE Vernova)', sector: 'Eléctrico', lat: 32.5265, lng: -116.9223, address: 'Mesa de Otay, Tijuana, BC', employees: 700, potential: 5, status: 'prospecto' },

  // ── Parque Industrial El Florido ──────────────────────────────────────
  { name: 'Hyundai Mobis', sector: 'Automotriz', lat: 32.4802, lng: -116.8827, address: 'Parque Industrial El Florido, Tijuana, BC', employees: 2200, potential: 5, status: 'prospecto' },
  { name: 'Foxconn México', sector: 'Electrónico', lat: 32.4825, lng: -116.8775, address: 'Parque Industrial El Florido, Tijuana, BC', employees: 4000, potential: 4, status: 'prospecto' },
  { name: 'Johnson Controls', sector: 'Automotriz', lat: 32.4798, lng: -116.8862, address: 'Parque Industrial El Florido, Tijuana, BC', employees: 1700, potential: 5, status: 'prospecto' },
  { name: 'Medtronic Neurológico', sector: 'Médico', lat: 32.4811, lng: -116.8841, address: 'Parque Industrial El Florido, Tijuana, BC', employees: 800, potential: 5, status: 'prospecto' },
  { name: 'Kyocera International', sector: 'Electrónico', lat: 32.4832, lng: -116.8812, address: 'Parque Industrial El Florido, Tijuana, BC', employees: 1300, potential: 3, status: 'prospecto' },
  { name: 'Jabil Circuit', sector: 'Electrónico', lat: 32.4808, lng: -116.8851, address: 'Parque Industrial El Florido, Tijuana, BC', employees: 2800, potential: 4, status: 'prospecto' },
  { name: 'Boston Scientific', sector: 'Médico', lat: 32.4793, lng: -116.8869, address: 'Parque Industrial El Florido, Tijuana, BC', employees: 900, potential: 5, status: 'prospecto' },
  { name: 'Haas Automation México', sector: 'Metalmecánico', lat: 32.4840, lng: -116.8845, address: 'Parque Industrial El Florido, Tijuana, BC', employees: 350, potential: 5, status: 'prospecto' },
  { name: 'Flextronics (Flex Ltd)', sector: 'Electrónico', lat: 32.4789, lng: -116.8876, address: 'Parque Industrial El Florido, Tijuana, BC', employees: 3200, potential: 4, status: 'prospecto' },
  { name: 'Chamberlain Group', sector: 'Electrónico', lat: 32.4821, lng: -116.8830, address: 'Parque Industrial El Florido, Tijuana, BC', employees: 600, potential: 4, status: 'prospecto' },
  { name: 'Canon México', sector: 'Electrónico', lat: 32.4815, lng: -116.8823, address: 'Parque Industrial El Florido, Tijuana, BC', employees: 1100, potential: 3, status: 'prospecto' },
  { name: 'Regal Rexnord', sector: 'Metalmecánico', lat: 32.4826, lng: -116.8835, address: 'Parque Industrial El Florido, Tijuana, BC', employees: 550, potential: 5, status: 'prospecto' },
  { name: 'Orbis Corp', sector: 'Plástico', lat: 32.4795, lng: -116.8891, address: 'Parque Industrial El Florido, Tijuana, BC', employees: 400, potential: 2, status: 'prospecto' },

  // ── Parque Industrial Pacifico ────────────────────────────────────────
  { name: 'Honeywell Aerospace', sector: 'Aeroespacial', lat: 32.4178, lng: -116.9315, address: 'Parque Industrial Pacifico, Tijuana, BC', employees: 1200, potential: 5, status: 'prospecto' },
  { name: 'Zodiac Aerospace (Safran)', sector: 'Aeroespacial', lat: 32.4163, lng: -116.9341, address: 'Parque Industrial Pacifico, Tijuana, BC', employees: 850, potential: 5, status: 'prospecto' },
  { name: 'Celestica', sector: 'Electrónico', lat: 32.4155, lng: -116.9322, address: 'Parque Industrial Pacifico, Tijuana, BC', employees: 2000, potential: 4, status: 'prospecto' },
  { name: 'Molex de México', sector: 'Electrónico', lat: 32.4191, lng: -116.9298, address: 'Parque Industrial Pacifico, Tijuana, BC', employees: 1800, potential: 4, status: 'prospecto' },
  { name: 'Parker Hannifin', sector: 'Metalmecánico', lat: 32.4172, lng: -116.9309, address: 'Parque Industrial Pacifico, Tijuana, BC', employees: 700, potential: 5, status: 'prospecto' },

  // ── Parque Industrial Cuauhtémoc ──────────────────────────────────────
  { name: 'Kenworth Mexicana', sector: 'Automotriz', lat: 32.5183, lng: -116.9505, address: 'Parque Industrial Cuauhtémoc, Tijuana, BC', employees: 3100, potential: 5, status: 'prospecto' },
  { name: 'Eaton Corporation', sector: 'Eléctrico', lat: 32.4988, lng: -116.9498, address: 'Parque Industrial Cuauhtémoc, Tijuana, BC', employees: 950, potential: 5, status: 'prospecto' },
  { name: 'Hubbell Power Systems', sector: 'Eléctrico', lat: 32.4973, lng: -116.9512, address: 'Parque Industrial Cuauhtémoc, Tijuana, BC', employees: 600, potential: 4, status: 'prospecto' },
  { name: 'National Instruments (NI)', sector: 'Electrónico', lat: 32.4962, lng: -116.9487, address: 'Parque Industrial Cuauhtémoc, Tijuana, BC', employees: 750, potential: 5, status: 'prospecto' },
  { name: 'Vitro Automotriz', sector: 'Automotriz', lat: 32.4955, lng: -116.9523, address: 'Parque Industrial Cuauhtémoc, Tijuana, BC', employees: 1100, potential: 4, status: 'prospecto' },

  // ── Zona Industrial La Mesa ───────────────────────────────────────────
  { name: 'Infineon Technologies (IR)', sector: 'Electrónico', lat: 32.5123, lng: -116.9612, address: 'Zona Industrial La Mesa, Tijuana, BC', employees: 950, potential: 4, status: 'prospecto' },
  { name: 'Merit Medical Systems', sector: 'Médico', lat: 32.5138, lng: -116.9594, address: 'Zona Industrial La Mesa, Tijuana, BC', employees: 700, potential: 5, status: 'prospecto' },
  { name: 'ISOSA Electrónica', sector: 'Electrónico', lat: 32.5112, lng: -116.9625, address: 'Zona Industrial La Mesa, Tijuana, BC', employees: 320, potential: 3, status: 'prospecto' },
]

async function main() {
  console.log('Seeding plants...')
  const result = await prisma.plant.createMany({
    data: PLANTS.map(p => ({ ...p, updatedAt: new Date() })),
    skipDuplicates: false,
  })
  console.log(`Created ${result.count} plants.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
