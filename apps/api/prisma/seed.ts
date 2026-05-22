import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const exercises = [
  {
    name: "Barbell Back Squat",
    muscleGroups: ["legs", "glutes", "core"],
    equipment: "barbell",
    difficulty: "intermediate" as const,
    instructions: "Set the bar across your upper back, brace your core, squat until thighs are near parallel, then drive through your feet to stand."
  },
  {
    name: "Bench Press",
    muscleGroups: ["chest", "triceps", "shoulders"],
    equipment: "barbell",
    difficulty: "intermediate" as const,
    instructions: "Lie on the bench, lower the bar under control to mid-chest, then press up while keeping shoulder blades retracted."
  },
  {
    name: "Lat Pulldown",
    muscleGroups: ["back", "biceps"],
    equipment: "cable machine",
    difficulty: "beginner" as const,
    instructions: "Grip the bar slightly wider than shoulders, pull elbows down toward your ribs, and return slowly with control."
  },
  {
    name: "Romanian Deadlift",
    muscleGroups: ["hamstrings", "glutes", "back"],
    equipment: "barbell",
    difficulty: "intermediate" as const,
    instructions: "Hinge at the hips with a neutral spine, lower the bar along your legs, then squeeze glutes to stand tall."
  },
  {
    name: "Dumbbell Shoulder Press",
    muscleGroups: ["shoulders", "triceps"],
    equipment: "dumbbells",
    difficulty: "beginner" as const,
    instructions: "Press dumbbells overhead from shoulder height while keeping ribs down and wrists stacked."
  },
  {
    name: "Plank",
    muscleGroups: ["core"],
    equipment: "bodyweight",
    difficulty: "beginner" as const,
    instructions: "Hold a straight line from head to heels on forearms, brace the core, and avoid sagging hips."
  }
];

async function main() {
  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: exercise,
      create: exercise
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
