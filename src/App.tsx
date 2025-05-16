import { useState } from "react";
import "./App.css";

type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "veryActive";
type Gender = "male" | "female";
type GoalLevel = "cut" | "agressiveCut" | "maintain" | "leanBulk" | "bulk";

export default function App() {
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");
  const [goalLevel, setGoalLevel] = useState<GoalLevel>("maintain");
  const [result, setResult] = useState<{
    bmr: number;
    tdee: number;
    tdeeBase: number;
    goalLevel: GoalLevel;
    macros?: { protein: number; fats: number; carbs: number };
  } | null>(null);

  const handleNumberChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  const calculate = () => {
    const ageValue = age === "" ? 0 : parseFloat(age);
    const weightValue = weight === "" ? 0 : parseFloat(weight);
    const heightValue = height === "" ? 0 : parseFloat(height);

    let bmr: number;
    if (gender === "male") {
      bmr =
        88.362 + 13.397 * weightValue + 4.799 * heightValue - 5.677 * ageValue;
    } else {
      bmr =
        447.593 + 9.247 * weightValue + 3.098 * heightValue - 4.33 * ageValue;
    }

    const activityMultiplier = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const goalMultiplier = {
      cut: 0.85,
      agressiveCut: 0.7,
      maintain: 1,
      leanBulk: 1.1,
      bulk: 1.2,
    };

    const tdeeBase = bmr * activityMultiplier[activityLevel];
    const tdee = tdeeBase * goalMultiplier[goalLevel];

    const protein = weightValue * 2.5;
    const fats = weightValue * 0.8;
    const carbs = (tdee - protein * 4 - fats * 9) / 4;
    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      tdeeBase: Math.round(tdeeBase),
      goalLevel: goalLevel,
      macros: {
        protein: Math.round(protein),
        fats: Math.round(fats),
        carbs: Math.round(carbs),
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row justify-center items-start gap-6 max-w-5xl mx-auto">
        <div
          className={`bg-white rounded-xl shadow-md p-6 transition-transform duration-300 ${
            result ? "lg:-translate-x-10" : "lg:translate-x-0"
          } w-full max-w-md`}
        >
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            🥩 Calculadora de Gasto Calórico 🥗
          </h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sexo
              </label>
              <div className="flex space-x-4 mt-2">
                <button
                  onClick={() => setGender("male")}
                  className={`px-4 py-2 rounded-md ${
                    gender === "male"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  Masculino
                </button>
                <button
                  onClick={() => setGender("female")}
                  className={`px-4 py-2 rounded-md ${
                    gender === "female"
                      ? "bg-pink-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  Feminino
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium text-gray-700"
              >
                Idade
              </label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={handleNumberChange(setAge)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                min="0"
              />
            </div>
            <div>
              <label
                htmlFor="weight"
                className="block text-sm font-medium text-gray-700"
              >
                Peso (kg)
              </label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={handleNumberChange(setWeight)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label
                htmlFor="height"
                className="block text-sm font-medium text-gray-700"
              >
                Altura (cm)
              </label>
              <input
                type="number"
                id="height"
                value={height}
                onChange={handleNumberChange(setHeight)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nível de Atividade
              </label>
              <select
                value={activityLevel}
                onChange={(e) =>
                  setActivityLevel(e.target.value as ActivityLevel)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              >
                <option value="sedentary">
                  Sedentário (Pouco ou Nenhum Exercício)
                </option>
                <option value="light">
                  Levemente Ativo (Exercício Leve 1-3 dias na Semana)
                </option>
                <option value="moderate">
                  Moderadamente Ativo (Exercício Moderado 3-5 dias na Semana)
                </option>
                <option value="active">
                  Ativo (Exercício Intenso 6-7 dias na Semana)
                </option>
                <option value="veryActive">
                  Muito Ativo (Exercício Muito Intenso + Trabalho Físico)
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Objetivo
              </label>
              <select
                value={goalLevel}
                onChange={(e) => setGoalLevel(e.target.value as GoalLevel)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              >
                <option value="cut">Cutting (-500Kcal)</option>
                <option value="agressiveCut">
                  Cutting Agressivo (-800Kcal)
                </option>
                <option value="maintain">Manutenção de Peso</option>
                <option value="leanBulk">Bulking Leve (+300Kcal)</option>
                <option value="bulk">Bulking (+500Kcal)</option>
              </select>
            </div>
            <button
              onClick={calculate}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
            >
              Calcular
            </button>
          </div>
        </div>

        {result && (
          <div className="w-full max-w-md bg-gray-50 rounded-md p-6 transition-opacity duration-300">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Resultados</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">
                  Taxa Metabólica Basal (TMB):
                </span>{" "}
                {result.bmr} kcal/dia
              </p>
              <p>
                <span className="font-medium">
                  Gasto Calórico Diário (TDEE):
                </span>{" "}
                {result.tdeeBase} kcal/dia
              </p>
              <p>
                <span className="font-medium">
                  Com o objetivo de{" "}
                  {result.goalLevel === "cut"
                    ? "Cutting"
                    : result.goalLevel === "agressiveCut"
                    ? "Cutting Agressivo"
                    : result.goalLevel === "maintain"
                    ? "Manutenção de Peso"
                    : result.goalLevel === "leanBulk"
                    ? "Bulking Leve"
                    : "Bulking"}
                  , você precisa consumir:
                </span>{" "}
                {result.tdee} kcal/dia
              </p>
              {result?.macros && (
                <div className="mt-4 p-4 bg-gray-200 rounded-md">
                  <h3 className="font-medium text-gray-800">
                    Macronutrientes:
                  </h3>
                  <p>🍚 Carboidratos: {result.macros.carbs}g</p>
                  <p>🥩 Proteínas: {result.macros.protein}g</p>
                  <p>🥑 Gorduras: {result.macros.fats}g</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
