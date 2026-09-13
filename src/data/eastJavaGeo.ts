// GeoJSON dataset of East Java (Jawa Timur) for CoverageMap
export interface GeoFeature {
  type: 'Feature';
  properties: {
    id: string;
    name: string;
    isBase?: boolean;
    isCoverage?: boolean;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

export interface GeoFeatureCollection {
  type: 'FeatureCollection';
  features: GeoFeature[];
}

export const eastJavaGeoData: GeoFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    // Mainland East Java (Jawa Timur Daratan)
    {
      type: 'Feature',
      properties: {
        id: 'jatim-mainland',
        name: 'Jawa Timur',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [111.15, -7.38],
            [111.45, -7.15],
            [111.85, -6.88],
            [112.25, -6.85],
            [112.55, -6.95],
            [112.68, -7.12],
            [112.76, -7.18],
            [112.82, -7.32],
            [112.85, -7.52],
            [112.98, -7.62],
            [113.25, -7.72],
            [113.75, -7.70],
            [114.15, -7.68],
            [114.42, -7.82],
            [114.48, -8.15],
            [114.45, -8.55],
            [114.35, -8.72],
            [113.95, -8.55],
            [113.55, -8.38],
            [113.15, -8.30],
            [112.85, -8.32],
            [112.55, -8.40],
            [112.25, -8.35],
            [111.95, -8.28],
            [111.65, -8.30],
            [111.10, -8.22],
            [111.12, -7.95],
            [111.25, -7.68],
            [111.15, -7.38],
          ],
        ],
      },
    },
    // Pulau Madura
    {
      type: 'Feature',
      properties: {
        id: 'madura',
        name: 'Pulau Madura',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [112.68, -7.02],
            [112.95, -6.90],
            [113.35, -6.88],
            [113.78, -6.85],
            [114.05, -6.92],
            [114.08, -7.10],
            [113.75, -7.18],
            [113.30, -7.20],
            [112.90, -7.18],
            [112.68, -7.12],
            [112.68, -7.02],
          ],
        ],
      },
    },
    // Region Highlight: Malang Raya (Base Utama)
    {
      type: 'Feature',
      properties: {
        id: 'malang-regency',
        name: 'Malang Raya',
        isBase: true,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [112.45, -7.80],
            [112.78, -7.78],
            [112.88, -8.05],
            [112.75, -8.35],
            [112.48, -8.32],
            [112.38, -8.08],
            [112.45, -7.80],
          ],
        ],
      },
    },
    // Region Highlight: Pasuruan (Wilayah Pengerjaan)
    {
      type: 'Feature',
      properties: {
        id: 'pasuruan-regency',
        name: 'Pasuruan & Pandaan',
        isCoverage: true,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [112.65, -7.58],
            [112.95, -7.56],
            [113.08, -7.72],
            [112.92, -7.88],
            [112.68, -7.80],
            [112.65, -7.58],
          ],
        ],
      },
    },
    // Region Highlight: Surabaya & Sidoarjo (Wilayah Pengerjaan)
    {
      type: 'Feature',
      properties: {
        id: 'surabaya-regency',
        name: 'Surabaya & Sidoarjo',
        isCoverage: true,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [112.62, -7.18],
            [112.82, -7.18],
            [112.86, -7.48],
            [112.65, -7.48],
            [112.62, -7.18],
          ],
        ],
      },
    },
  ],
};
