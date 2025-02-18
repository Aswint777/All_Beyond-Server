import { constant } from "../../../_lib/common/constant";
import { UserEntity } from "../../../domain/entities/User";
import { IDependencies } from "../../interfaces/IDependencies";
import bcrypt, { compare } from "bcrypt";


export const ProfileEditUseCase = (dependencies : IDependencies) => {
    
    const {repositories : {profileEdit}} = dependencies
    return {
        execute : async(data:UserEntity) =>{
            try {
                console.log(data,'data');
                
                return await profileEdit(data)
            } catch (error:constant) {
                console.log('Error in profile edit');
                
                throw new Error(error?.message || "Error in profile");

            }
        }
    }
}


export const changePasswordUseCase = (dependencies : IDependencies) => {
    
    const {repositories : {checkByEmail}} = dependencies
    return {
        execute : async(email:string,currentPassword:string,newPassword:string,confirmPassword:string) =>{
            try {
                console.log('data');
                if (newPassword !== confirmPassword){
                    return false
                }
                const checkPassword = await checkByEmail(email)
                  if (!checkPassword) {
                          return false;
                        }
                        if (!checkPassword.password) return null;
                        console.log(checkPassword, "user in the change password use case");
                        const isMatch = await bcrypt.compare(currentPassword, checkPassword.password);
                        if (!isMatch) {
                          return false;
                        }
                        return true

                
            } catch (error:constant) {
                console.log('Error in change password');
                
                throw new Error(error?.message || "Error in profile");

            }
        }
    }
}





export const uploadPhotoUseCase = (dependencies : IDependencies) => {
    
    const {repositories : {uploadPhoto}} = dependencies
    return {
        execute : async(userId:string,profilePhoto:string) =>{
            try {
              await uploadPhoto(userId,profilePhoto)
            } catch (error:constant) {
                console.log('Error in change photo');
                
                throw new Error(error?.message || "Error in photo");

            }
        }
    }
}
