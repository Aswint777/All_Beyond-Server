import { category } from "../../database/model";

export const categoryEdit = async (
  id: string,
  name: string,
  description: string,
  type: string
): Promise<boolean | null> => {
  try {
    console.log('categoryEdit repo');
    const edit = await category.findOneAndUpdate({_id:id},{$set:{name:name,description:description,type:type}})
    if(edit){
        return true
    }
        return null
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error is occurred");
  }
};
