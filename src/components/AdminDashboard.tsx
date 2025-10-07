import React, { useState, useEffect } from "react";
import {
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  User,
  Crown,
  AlertCircle,
  Download,
  Search,
  MoreVertical,
  CreditCard as Edit,
  Trash2,
  Mail,
  Phone,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: "free" | "basic" | "premium" | "enterprise";
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  lastActivity: string;
  totalExpenses: number;
  monthlySpent: number;
  revenue: number;
}

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  churnRate: number;
  avgRevenuePerUser: number;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    churnRate: 0,
    avgRevenuePerUser: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Simular dados
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: "1",
        name: "João Silva",
        email: "joao@email.com",
        phone: "(11) 99999-9999",
        plan: "premium",
        status: "active",
        createdAt: "2024-01-15",
        lastActivity: "2024-01-20",
        totalExpenses: 156,
        monthlySpent: 2450.8,
        revenue: 19.9,
      },
      {
        id: "2",
        name: "Maria Santos",
        email: "maria@email.com",
        phone: "(11) 88888-8888",
        plan: "basic",
        status: "active",
        createdAt: "2024-01-10",
        lastActivity: "2024-01-19",
        totalExpenses: 89,
        monthlySpent: 1230.5,
        revenue: 9.9,
      },
      {
        id: "3",
        name: "Pedro Costa",
        email: "pedro@email.com",
        phone: "(11) 77777-7777",
        plan: "free",
        status: "active",
        createdAt: "2024-01-18",
        lastActivity: "2024-01-20",
        totalExpenses: 23,
        monthlySpent: 456.3,
        revenue: 0,
      },
      {
        id: "4",
        name: "Ana Oliveira",
        email: "ana@email.com",
        phone: "(11) 66666-6666",
        plan: "enterprise",
        status: "active",
        createdAt: "2024-01-05",
        lastActivity: "2024-01-19",
        totalExpenses: 234,
        monthlySpent: 3890.45,
        revenue: 49.9,
      },
      {
        id: "5",
        name: "Carlos Mendes",
        email: "carlos@email.com",
        phone: "(11) 55555-5555",
        plan: "basic",
        status: "inactive",
        createdAt: "2024-01-12",
        lastActivity: "2024-01-15",
        totalExpenses: 45,
        monthlySpent: 678.9,
        revenue: 9.9,
      },
    ];

    setUsers(mockUsers);

    const totalRevenue = mockUsers.reduce((sum, user) => sum + user.revenue, 0);
    const activeUsers = mockUsers.filter((u) => u.status === "active").length;

    setStats({
      totalUsers: mockUsers.length,
      activeUsers,
      totalRevenue,
      monthlyRevenue: totalRevenue,
      churnRate: 12.5,
      avgRevenuePerUser: totalRevenue / mockUsers.length,
    });
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === "all" || user.plan === filterPlan;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesPlan && matchesStatus;
  });

  const getPlanColor = (plan: string) => {
    const colors = {
      free: "bg-gray-100 text-gray-800",
      basic: "bg-blue-100 text-blue-800",
      premium: "bg-purple-100 text-purple-800",
      enterprise: "bg-yellow-100 text-yellow-800",
    };
    return colors[plan as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-yellow-100 text-yellow-800",
      suspended: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const exportData = () => {
    const csvContent = [
      [
        "Nome",
        "Email",
        "Telefone",
        "Plano",
        "Status",
        "Receita",
        "Gastos",
        "Criado em",
      ].join(","),
      ...filteredUsers.map((user) =>
        [
          user.name,
          user.email,
          user.phone,
          user.plan,
          user.status,
          `R$ ${user.revenue.toFixed(2)}`,
          user.totalExpenses,
          new Date(user.createdAt).toLocaleDateString("pt-BR"),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `usuarios-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total de Usuários
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalUsers}
              </p>
            </div>
            <Users className="h-10 w-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Usuários Ativos
              </p>
              <p className="text-3xl font-bold text-green-600">
                {stats.activeUsers}
              </p>
            </div>
            <TrendingUp className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita Total</p>
              <p className="text-3xl font-bold text-purple-600">
                R$ {stats.totalRevenue.toFixed(2)}
              </p>
            </div>
            <DollarSign className="h-10 w-10 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Receita Mensal
              </p>
              <p className="text-3xl font-bold text-orange-600">
                R$ {stats.monthlyRevenue.toFixed(2)}
              </p>
            </div>
            <Calendar className="h-10 w-10 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Churn</p>
              <p className="text-3xl font-bold text-red-600">
                {stats.churnRate}%
              </p>
            </div>
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ARPU</p>
              <p className="text-3xl font-bold text-indigo-600">
                R$ {stats.avgRevenuePerUser.toFixed(2)}
              </p>
            </div>
            <Crown className="h-10 w-10 text-indigo-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os planos</option>
              <option value="free">Gratuito</option>
              <option value="basic">Básico</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Empresarial</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os status</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="suspended">Suspenso</option>
            </select>
          </div>

          <button
            onClick={exportData}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Usuários Cadastrados ({filteredUsers.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gastos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Atividade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{user.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(
                        user.plan
                      )}`}
                    >
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      R$ {user.revenue.toFixed(2)}/mês
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>{user.totalExpenses} gastos</div>
                      <div className="text-xs text-gray-500">
                        R$ {user.monthlySpent.toFixed(2)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.lastActivity).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
