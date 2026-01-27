import {
  generateToken,
  hashPassword,
  validatePasswordStrength,
  verifyPassword,
} from '@rent-a-wheel/auth';
import { User } from '@rent-a-wheel/database';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '../../common/exceptions';
import { UserRepository } from '../../infrastructure/database/repositories';
import { LoginDto, RegisterDto } from './dto/auth.dto';

export interface AuthResult {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    tenantId: string | null;
  };
  token: string;
}

/**
 * Auth Service
 * Contains all authentication business logic
 */
export class AuthService {
  constructor(private readonly userRepo: UserRepository) {}

  /**
   * Register a new user
   */
  async register(dto: RegisterDto): Promise<AuthResult> {
    // Validate password strength
    const passwordValidation = validatePasswordStrength(dto.password);
    if (!passwordValidation.valid) {
      throw new BadRequestException('Weak password', passwordValidation.errors);
    }

    // Check if user already exists
    const existingUser = await this.userRepo.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash password and create user
    const passwordHash = await hashPassword(dto.password);
    const user = await this.userRepo.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
      tenantId: dto.tenantId,
      role: dto.tenantId ? 'TENANT_USER' : 'TENANT_ADMIN',
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId || undefined,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
      },
      token,
    };
  }

  /**
   * Login with email and password
   */
  async login(dto: LoginDto): Promise<AuthResult> {
    // Find user
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isValid = await verifyPassword(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.userRepo.updateLastLogin(user.id);

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId || undefined,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
      },
      token,
    };
  }

  /**
   * Get current user profile
   */
  async getProfile(userId: string): Promise<User | null> {
    return this.userRepo.findById(userId);
  }
}
