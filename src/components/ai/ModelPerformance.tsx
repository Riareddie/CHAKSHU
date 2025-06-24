
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Brain, Target, TrendingUp, Award } from 'lucide-react';

const ModelPerformance = () => {
  const performanceMetrics = [
    { metric: 'Accuracy', value: 97.8, benchmark: 95.0, status: 'excellent' },
    { metric: 'Precision', value: 96.4, benchmark: 93.0, status: 'excellent' },
    { metric: 'Recall', value: 94.7, benchmark: 90.0, status: 'good' },
    { metric: 'F1-Score', value: 95.5, benchmark: 91.5, status: 'excellent' },
    { metric: 'Specificity', value: 98.9, benchmark: 96.0, status: 'excellent' },
    { metric: 'AUC-ROC', value: 99.2, benchmark: 97.0, status: 'excellent' }
  ];

  const modelComparison = [
    { model: 'Deep Learning v3.2', accuracy: 97.8, speed: 89, stability: 96 },
    { model: 'Ensemble v2.1', accuracy: 95.6, speed: 92, stability: 94 },
    { model: 'Random Forest', accuracy: 91.3, speed: 96, stability: 89 },
    { model: 'SVM Optimized', accuracy: 88.7, speed: 94, stability: 91 },
    { model: 'Naive Bayes', accuracy: 84.2, speed: 98, stability: 87 }
  ];

  const confusionMatrix = [
    { name: 'True Positive', value: 1847, color: '#22c55e' },
    { name: 'True Negative', value: 7632, color: '#3b82f6' },
    { name: 'False Positive', value: 89, color: '#f59e0b' },
    { name: 'False Negative', value: 42, color: '#ef4444' }
  ];

  const trainingProgress = [
    { epoch: 1, accuracy: 0.78, loss: 0.45 },
    { epoch: 5, accuracy: 0.89, loss: 0.23 },
    { epoch: 10, accuracy: 0.94, loss: 0.15 },
    { epoch: 15, accuracy: 0.96, loss: 0.09 },
    { epoch: 20, accuracy: 0.97, loss: 0.06 },
    { epoch: 25, accuracy: 0.978, loss: 0.045 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'average': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const chartConfig = {
    accuracy: { label: "Accuracy", color: "#3b82f6" },
    loss: { label: "Loss", color: "#ef4444" },
  };

  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Machine Learning Model Performance Metrics</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Comprehensive performance analytics showing model accuracy, training progress, 
          and comparative analysis across different ML algorithms.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{metric.metric}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{metric.value}%</div>
              <div className="flex items-center gap-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                  vs {metric.benchmark}%
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Model Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {modelComparison.map((model, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{model.model}</span>
                    <span className="text-sm text-gray-600">{model.accuracy}%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Accuracy</span>
                        <span>{model.accuracy}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${model.accuracy}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Speed</span>
                        <span>{model.speed}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${model.speed}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Stability</span>
                        <span>{model.stability}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${model.stability}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Confusion Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <PieChart>
                <Pie
                  data={confusionMatrix}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {confusionMatrix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="font-semibold text-green-800">True Positive</div>
                <div className="text-green-600">1,847 cases</div>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="font-semibold text-blue-800">True Negative</div>
                <div className="text-blue-600">7,632 cases</div>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded">
                <div className="font-semibold text-yellow-800">False Positive</div>
                <div className="text-yellow-600">89 cases</div>
              </div>
              <div className="text-center p-2 bg-red-50 rounded">
                <div className="font-semibold text-red-800">False Negative</div>
                <div className="text-red-600">42 cases</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Training Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <LineChart data={trainingProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="epoch" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={3} />
              <Line type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={3} />
            </LineChart>
          </ChartContainer>
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Training Insights:</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Model converged after 25 epochs with minimal overfitting</li>
              <li>• Validation accuracy remained stable, indicating good generalization</li>
              <li>• Loss function decreased consistently throughout training</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ModelPerformance;
