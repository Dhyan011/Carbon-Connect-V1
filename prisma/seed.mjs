import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const buyer = await prisma.organization.upsert({ where: { id: 'org-buyer-demo' }, update: {}, create: { id: 'org-buyer-demo', legalName: 'Maharashtra Concrete Systems', displayName: 'Maharashtra Concrete Systems', type: 'BUYER', status: 'ACTIVE', city: 'Mumbai', state: 'Maharashtra', contactEmail: 'buyer@carbon-connect.demo' } });
  const seller = await prisma.organization.upsert({ where: { id: 'org-seller-demo' }, update: {}, create: { id: 'org-seller-demo', legalName: 'Kutch Industrial Materials Pvt. Ltd.', displayName: 'Kutch Industrial Materials', type: 'SELLER', status: 'ACTIVE', city: 'Mundra', state: 'Gujarat', contactEmail: 'seller@carbon-connect.demo' } });
  for (const [email, role, org] of [['buyer@carbon-connect.demo', 'BUYER_ADMIN', buyer], ['seller@carbon-connect.demo', 'SELLER_ADMIN', seller]]) {
    const user = await prisma.user.upsert({ where: { email }, update: {}, create: { email, passwordHash: 'demo-password', status: 'ACTIVE', emailVerifiedAt: new Date() } });
    await prisma.organizationMembership.upsert({ where: { organizationId_userId: { organizationId: org.id, userId: user.id } }, update: { role }, create: { organizationId: org.id, userId: user.id, role, status: 'ACTIVE' } });
  }
  const facility = await prisma.facility.create({ data: { organizationId: seller.id, name: 'Kutch Capture & Conditioning Unit', facilityType: 'Cement kiln capture', city: 'Mundra', state: 'Gujarat', annualCapacityTonnes: 240000 } });
  const listing = await prisma.listing.create({ data: { organizationId: seller.id, facilityId: facility.id, listingCode: 'CC-L-4820', title: 'Industrial Grade CO₂ — Liquid', grade: 'Industrial Grade CO₂', purityMinimum: 99.51, physicalState: 'liquid', availableQuantityTonnes: 8400, minimumOrderTonnes: 50, basePriceInrPerTonne: 89, status: 'PUBLISHED', demoOnly: true } });
  const rfq = await prisma.rfq.create({ data: { rfqCode: 'CC-RFQ-2041', buyerOrganizationId: buyer.id, createdBy: 'seed', title: 'Q4 2026 Concrete Mineralization', gradeRequired: 'Captured CO₂ ≥95%', quantityTonnes: 3200, deliveryAddress: 'Maharashtra Concrete Systems, Mumbai', deliveryCity: 'Mumbai', deliveryState: 'Maharashtra', budgetMinInrPerTonne: 67, budgetMaxInrPerTonne: 80, status: 'BIDS_RECEIVED', publishedAt: new Date(), bids: { create: { bidCode: 'CC-BID-7012', sellerOrganizationId: seller.id, listingId: listing.id, quantityTonnes: 3200, exWorksPriceInrPerTonne: 72, logisticsPriceInrPerTonne: 6, deliveredPriceInrPerTonne: 78, totalEstimatedValueInr: 249600, leadTimeBusinessDays: 5, evidenceSummary: '4 verified documents', status: 'SUBMITTED', submittedAt: new Date() } } } });
  await prisma.complianceContextRecord.create({ data: { organizationId: seller.id, framework: 'CCTS', recordType: 'Educational market context', status: 'REQUIRES_OFFICIAL_REVIEW', notes: 'This record does not establish CCTS compliance or certificate eligibility.' } });
  console.log(`Seeded buyer ${buyer.id}, seller ${seller.id}, listing ${listing.id}, RFQ ${rfq.id}`);
}
main().finally(() => prisma.$disconnect());
