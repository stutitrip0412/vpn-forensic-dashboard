import api from "./axios";

export const uploadEvidence = (
    caseId,
    formData,
    onUploadProgress
) =>
    api.post(
        `/cases/${caseId}/evidence`,
        formData,
        {
            headers:{
                "Content-Type":"multipart/form-data"
            },
            onUploadProgress
        }
    );