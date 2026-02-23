export interface RegisterDto {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}