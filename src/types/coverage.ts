/**
 * @file coverage.ts
 * @description Type definitions for geographic operational coverage and base locations.
 */

export interface SampleProjectItem {
  readonly title: string;
  readonly category: string;
  readonly slug: string;
  readonly img: string;
}

export interface ServiceLocation {
  readonly id: string;
  readonly name: string;
  readonly city: string;
  readonly shortName: string;
  readonly role: string;
  readonly status: string;
  readonly isHQ: boolean;
  readonly isBase: boolean;
  readonly address: string;
  readonly coordinates: [number, number]; // [longitude, latitude]
  readonly latLng?: [number, number]; // [latitude, longitude] for Leaflet
  readonly coverage: readonly string[];
  readonly services: string;
  readonly highlight: string;
  readonly badge: string;
  readonly description: string;
  readonly details: string;
  readonly labelOffsetX: number;
  readonly labelOffsetY: number;
  readonly image?: string;
  readonly travelTime?: string;
  readonly tollRoute?: string;
  readonly projectCount?: string;
  readonly districts?: readonly string[];
  readonly sampleProjects?: readonly SampleProjectItem[];
}
