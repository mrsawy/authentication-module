import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Roles } from '../enums/roles.enum';

@Schema({ _id: false })
class Address {
    @Prop()
    street: string;

    @Prop()
    city: string;

    @Prop()
    state: string;

    @Prop()
    zipCode: string;

    @Prop()
    country: string;
}

@Schema({ _id: false })
class SocialLinks {
    @Prop()
    linkedin: string;

    @Prop()
    twitter: string;
}

@Schema({ _id: false })
class Profile {

    @Prop({ required: false })
    bio?: string;

    @Prop({ required: false })
    shortBio?: string;

    @Prop({ required: false })
    dateOfBirth?: Date;

    @Prop({ type: Address, required: false })
    address?: Address;

    @Prop({ type: SocialLinks, required: false })
    socialLinks?: SocialLinks;

    @Prop({ type: Number, required: true, default: 0 })
    totalFollowing: number
}

@Schema({ _id: false })
class Preferences {
    @Prop({ required: false, default: "en" })
    language?: string;

    @Prop({ required: false, default: false })
    darkMode?: boolean;
}

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({
        required: true,
        unique: true,
        index: true,
        trim: true,
        lowercase: true
    })
    username: string;


    @Prop({ required: true, unique: true })
    email: string;


    @Prop({ required: true, unique: true })
    phone: string;


    @Prop({ required: true })
    password: string;

    @Prop({ required: true, type: String })
    firstName: string;

    
    @Prop({ required: true, type: String })
    lastName: string;

    @Prop({ type: Profile, required: false })
    profile: Profile;

    @Prop({ type: Preferences })
    preferences: Preferences;

    @Prop({ required: false })
    lastLogin?: Date;
    

}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(mongoosePaginate)


