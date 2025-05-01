export interface ReviewData {
  userId?: string;
  courseId?: string;
  rating?: number;
  comment?: string;
}

export interface AverageReview {
  count? : number
  average?:number
}