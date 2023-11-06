export const EventPatterns = {
  login: 'login',
  create_user: 'create_user',
  process_payment: 'process_payment',
  get_user: 'get_user',
  get_all_users: 'get_all_users',
  verify_jwt: 'verify-jwt',
  decode_jwt: 'decode_jwt',
  send_message: 'send_message',
  reset_password: 'reset_password',
  forgot_password: 'forgot_password',
  forgot_password_email: 'forgot_password_email',
} as const;