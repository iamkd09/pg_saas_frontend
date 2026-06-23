export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const AUTH_ENDPOINTS = {
  login: "/api/login/",
  register: "/api/register/",
  refresh: "/api/token/refresh/",
} as const;

export const API_ENDPOINTS = {
  homepage: "/api/homepage/",
  profile: "/api/profile/",
  changePassword: "/api/profile/change-password/",
  users: "/api/users/",
  createManager: "/api/users/managers/",
  createTenantAccount: "/api/users/tenant-accounts/",
  userDetail: (id: number) => `/api/users/${id}/`,
  organization: "/api/organization/",
  organizationStats: "/api/organization/stats/",
  notices: "/api/notices/",
  noticeDetail: (id: number) => `/api/notices/${id}/`,
  properties: "/api/properties/",
  propertyDetail: (id: number) => `/api/properties/${id}/`,
  propertyRooms: (propertyId: number) => `/api/properties/${propertyId}/rooms/`,
  roomBeds: (roomId: number) => `/api/rooms/${roomId}/beds/`,
  vacantBeds: "/api/beds/vacant/",
  tenants: "/api/tenants/",
  tenantDetail: (id: number) => `/api/tenants/${id}/`,
  tenantMine: "/api/tenants/mine/",
  assignBed: (id: number) => `/api/tenants/${id}/assign-bed/`,
  checkoutTenant: (id: number) => `/api/tenants/${id}/checkout/`,
  rents: "/api/rents/",
  rentsMine: "/api/rents/mine/",
  generateMonthlyRents: "/api/rents/generate-monthly/",
  recordPayment: (rentId: number) => `/api/rents/${rentId}/record-payment/`,
  complaints: "/api/complaints/",
  complaintDetail: (id: number) => `/api/complaints/${id}/`,
  complaintsMine: "/api/complaints/mine/",
  adminDashboard: "/api/admin/dashboard/",
  adminOrganizations: "/api/admin/organizations/",
  adminOrganizationDetail: (id: number) => `/api/admin/organizations/${id}/`,
  adminUsers: "/api/admin/users/",
  adminUserDetail: (id: number) => `/api/admin/users/${id}/`,
  adminCreateOwner: "/api/admin/owners/",
  schema: "/api/schema/",
  docs: "/api/docs/",
} as const;

export const TOKEN_KEYS = {
  access: "pg_access_token",
  refresh: "pg_refresh_token",
} as const;
