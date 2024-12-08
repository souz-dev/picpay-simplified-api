import axios from "axios";
import { prismaClient } from "../libs/prismaClient";

interface NotificationOptions {
  type?: "email" | "sms" | "push";
  priority?: "low" | "normal" | "high";
  additionalData?: Record<string, unknown>; // Para dados extras opcionais
}

interface INotificationService {
  sendNotification(
    userId: string,
    message: string,
    options?: NotificationOptions
  ): Promise<void>;
  createNotification(userId: string, message: string): Promise<void>;
  getNotifications(
    userId: string
  ): Promise<Array<{ message: string; createdAt: Date }>>;
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000,
  growthFactor: number = 2
): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt < retries) {
        console.warn(
          `Tentativa ${attempt} falhou. Erro: ${
            (error as Error)?.message || error
          }. Reenviando em ${delay}ms.`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= growthFactor;
      } else {
        console.error(
          `Todas as ${retries} tentativas falharam. Último erro: ${
            (error as Error)?.message || error
          }`
        );
        throw error;
      }
    }
  }

  throw new Error("Unexpected error in retryWithBackoff.");
}

export class NotificationService implements INotificationService {
  private notificationApiUrl = "https://util.devi.tools/api/v1/notify";

  async sendNotification(
    userId: string,
    message: string,
    options?: NotificationOptions
  ): Promise<void> {
    try {
      const payload = {
        to: userId,
        message,
        type: options?.type || "email",
        priority: options?.priority || "normal",
        additionalData: options?.additionalData,
      };

      const response = await axios.post(this.notificationApiUrl, payload, {
        timeout: 5000,
      });

      if (response.status === 200) {
        console.log("Notificação enviada com sucesso:", response.data);
      } else {
        throw new Error(
          `Falha no envio da notificação. Status: ${response.status}`
        );
      }
    } catch (error) {
      console.error("Erro ao enviar a notificação:", error);

      await this.createNotification(userId, `Falha no envio: ${message}`);
    }
  }

  async createNotification(userId: string, message: string): Promise<void> {
    await prismaClient.notification.create({
      data: {
        userId,
        message,
      },
    });
  }

  async getNotifications(
    userId: string
  ): Promise<Array<{ message: string; createdAt: Date }>> {
    const notifications = await prismaClient.notification.findMany({
      where: { userId },
      select: {
        message: true,
        createdAt: true,
      },
    });

    return notifications;
  }
}
