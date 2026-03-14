export interface SpinResult {
  prizeId: string;
  prizeName: string;
  prizeDescription: string | null;
  prizeIcon: string;
  prizeColor: string;
  segmentIndex: number;
  participationId: string;
}

export interface ReviewFormData {
  rating: number;
  comment: string;
}
