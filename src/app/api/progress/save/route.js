import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import UserProgress from '@/models/UserProgress';
import User from '@/models/User';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
    }

    const { manualId, progress, completedTopics } = await request.json();

    if (!manualId) {
      return NextResponse.json({ message: 'manualId é obrigatório' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
    }

    const completed = progress === 100;

    const userProgress = await UserProgress.findOneAndUpdate(
      { userId: user._id, manualId },
      {
        progress: progress || 0,
        completedTopics: completedTopics || [],
        completed,
        lastAccessed: new Date(),
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: userProgress });
  } catch (error) {
    console.error('Erro ao salvar progresso:', error);
    return NextResponse.json(
      { message: 'Erro ao salvar progresso' },
      { status: 500 }
    );
  }
}
