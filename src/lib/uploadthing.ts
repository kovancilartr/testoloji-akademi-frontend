import {
    generateUploadButton,
    generateUploadDropzone,
} from "@uploadthing/react";

// Note: In a production environment with multiple repos, we redefine or import types from a shared package.
// For now, we define as 'any' to break the build-time dependency on the backend directory.
export type OurFileRouter = any;

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
