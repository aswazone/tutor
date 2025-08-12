export interface IReview {
    reviewerId: {
        _id: string;
        userName: string;
        userEmail: string;
        profileImage: string;
    };
    reviewType: string;
    relatedId:string;
    rating: number;
    review: string;
    createdDate: string;
}