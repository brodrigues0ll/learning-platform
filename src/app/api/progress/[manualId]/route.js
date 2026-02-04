import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import UserProgress from '@/models/UserProgress';
import User from '@/models/User';

export async function GET(request, { params }) {
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

    const progress = await UserProgress.findOne({
      userId: user._id,
      manualId: params.manualId,
    });

    if (!progress) {
      return NextResponse.json({
        progress: 0,
        completedTopics: [],
        completed: false,
      });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Erro ao buscar progresso:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar progresso' },
      { status: 500 }
    );
  }
}
