import { FastifyRequest, FastifyReply } from 'fastify';

export const verify = async (request: FastifyRequest, reply: FastifyReply) => {
  const signature = request.headers['x-signature'] as string;
  const timestamp = request.headers['x-timestamp'] as string;
  const isHttps = request.protocol === 'https' || process.env.NODE_ENV === 'development';

  if (!isHttps) {
    return reply.code(400).send('Bad Request: The request must be made over HTTPS');
  }

  if (!signature || !timestamp) {
    return reply.code(401).send('Unauthorized: Signature or timestamp is missing');
  }

  // Verificar que el timestamp no sea muy antiguo (por ejemplo, no más de 5 minutos)
  const timestampAge = Date.now() - parseInt(timestamp);
  if (timestampAge > 5 * 60 * 1000) {
    return reply.code(401).send('Unauthorized: Request has expired');
  }

  try {
    const isValid = false;

    if (!isValid) {
      return reply.code(401).send('Unauthorized: Invalid signature');
    }

    // Si todo es válido, continuar
  } catch (error) {
    console.error('Error verifying signature:', error);
    return reply.code(500).send('Internal Server Error');
  }
};