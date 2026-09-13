/**
 * @file services.ts
 * @description Type definitions for services, workflow, testimonials, partners, and FAQs.
 */

export interface ServiceItem {
  readonly id: string;
  readonly title: string;
  readonly shortTitle: string;
  readonly description: string;
  readonly icon: string;
  readonly image: string;
  readonly href: string;
  readonly features?: readonly string[];
}

export interface WorkflowStep {
  readonly number: string;
  readonly title: string;
  readonly desc: string;
  readonly deliverable: string;
  readonly phaseTag?: string;
  readonly duration?: string;
  readonly milestones?: readonly string[];
  readonly badgeText?: string;
  readonly image?: string;
}

export interface TestimonialItem {
  readonly name: string;
  readonly role: string;
  readonly image: string;
  readonly quote: string;
  readonly rating: number;
  readonly project?: string;
}

export interface PartnerBrand {
  readonly id: number;
  readonly name: string;
  readonly src: string;
}

export type FaqCategory = 'biaya' | 'proses' | 'material' | 'garansi';

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
  readonly category: FaqCategory;
}
