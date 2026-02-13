const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.uploadVerificationDocs = async (userId, data) => {
    const { idDocument, drivingLicense } = data;

    return prisma.user.update({
        where: { id: Number(userId) },
        data: {
            idDocument: idDocument || undefined,
            drivingLicense: drivingLicense || undefined,
            // Reset verification status if new docs are uploaded
            isVerified: false,
        },
        select: {
            id: true,
            name: true,
            isVerified: true,
            idDocument: true,
            drivingLicense: true,
        }
    });
};

exports.verifyUser = async (userId, isVerified) => {
    return prisma.user.update({
        where: { id: Number(userId) },
        data: { isVerified },
        select: {
            id: true,
            name: true,
            isVerified: true,
        }
    });
};

exports.getVerificationStatus = async (userId) => {
    return prisma.user.findUnique({
        where: { id: Number(userId) },
        select: {
            id: true,
            isVerified: true,
            idDocument: true,
            drivingLicense: true,
        }
    });
};
