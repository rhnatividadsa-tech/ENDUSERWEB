import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { DonationsModule } from './donations/donations.module';
import { VolunteersModule } from './volunteers/volunteers.module';

@Module({
  imports: [
    // Load .env into process.env globally
    ConfigModule.forRoot({ isGlobal: true }),

    // Decoupled modules — each can be extracted to its own microservice
    SupabaseModule,
    AuthModule,
    DonationsModule,
    VolunteersModule,
  ],
})
export class AppModule {}
