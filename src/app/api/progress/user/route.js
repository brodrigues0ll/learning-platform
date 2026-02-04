import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import UserProgress from '@/models/UserProgress';
import User from '@/models/User';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
    }

    const allProgress = await UserProgress.find({ userId: user._id });

    // Transformar em objeto indexado por manualId
    const progressMap = {};
    allProgress.forEach((p) => {
      progressMap[p.manualId] = {
        progress: p.progress,
        completedTopics: p.completedTopics,
        completed: p.completed,
        lastAccessed: p.lastAccessed,
      };
    });

    return NextResponse.json(progressMap);
  } catch (error) {
    console.error('Erro ao buscar progresso do usuário:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar progresso' },
      { status: 500 }
    );
  }
}
