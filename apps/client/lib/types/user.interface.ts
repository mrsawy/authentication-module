

export interface Address {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
}

export interface SocialLinks {
    linkedin?: string;
    twitter?: string;
}

export interface Profile {
    bio?: string;
    avatar?: string;
    dateOfBirth?: Date;
    address?: Address;
    socialLinks?: SocialLinks;
    shortBio?: string
}

export interface IUser {
    _id: string;
    username: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    roleName: string;
    profile?: Profile;
    createdAt: Date;
    updatedAt: Date;
}
