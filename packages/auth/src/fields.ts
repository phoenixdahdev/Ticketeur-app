export const userAdditionalFields = {
  requestedRole: { type: 'string', required: false, input: true },
  orgName: { type: 'string', required: false, input: true },
  orgType: { type: 'string', required: false, input: true },
  businessName: { type: 'string', required: false, input: true },
  businessCategory: { type: 'string', required: false, input: true },
  businessDescription: { type: 'string', required: false, input: true },
} as const
