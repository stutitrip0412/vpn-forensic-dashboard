import { uploadEvidence } from "../api/uploadApi";

export const uploadVPNLog = async (
    caseId,
    file,
    sourceType,
    onProgress
) => {

    const formData = new FormData();

    formData.append("file", file);

    if(sourceType){

        formData.append("sourceType",sourceType);

    }

    const response = await uploadEvidence(
        caseId,
        formData,
        onProgress
    );

    return response.data;
};