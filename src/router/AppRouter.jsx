import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import NotFound from "../pages/NotFound/NotFound";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import SuperAdminDashboard from "../pages/SuperAdmin/SuperAdminDashboard";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import ManagerDashboard from "../pages/Manager/ManagerDashboard";
import Artist from "../pages/SuperAdmin/Artist";
import UserManagement from "../pages/SuperAdmin/UserManagement";
import Releases from "../pages/SuperAdmin/Releases";
import RevenueReports from "../pages/SuperAdmin/RevenueReports";
import SalesAndTrends from "../pages/SuperAdmin/salesAndTrends";
import Payouts from "../pages/SuperAdmin/Payouts";
import Statements from "../pages/SuperAdmin/Statements";
import RevenueUpload from "../pages/SuperAdmin/RevenueUpload";
import Setting from "../pages/SuperAdmin/Setting";
import LabelSummary from "../pages/SuperAdmin/LabelSummary";
import LabelUpload from "../pages/SuperAdmin/LabelUpload";
import Conversion from "../pages/SuperAdmin/Conversion";
import Logs from "../pages/SuperAdmin/Logs";
import SubLabel from "../pages/SuperAdmin/SubLabel";
import LabelDashboard from "../pages/Label/LabelDashboard";
import SubLabelDashboard from "../pages/SubLabel/SubLabelDashboard";
import ArtistDetail from "../pages/SuperAdmin/ArtistDetail";
import ChangePassword from "../pages/Auth/ChangePassword";
import AddUser from "../pages/SuperAdmin/AddUser";
import BankDetail from "../pages/SuperAdmin/BankDetail";
import BankDetailForm from "../pages/SuperAdmin/BankDetailForm";
import Contract from "../pages/SuperAdmin/Contract";
import ContractForm from "../pages/SuperAdmin/ContractForm";
import ContractLog from "../pages/SuperAdmin/ContractLog";
import SubLabelSummary from "../pages/SuperAdmin/SubLabelSummary";
import LabelSummaryLabel from "../pages/Label/LabelSummary";
import ContractFormLabel from "../pages/Label/ContractForm";
import ContractLogLabel from "../pages/Label/ContractLog";
import SubLabelSummaryLabel from "../pages/Label/SubLabelSummary";
import ArtistLabel from "../pages/Label/Artist";
import UserManagementLabel from "../pages/Label/UserManagement";
import ReleasesLabel from "../pages/Label/Releases";
import RevenueReportsLabel from "../pages/Label/RevenueReports";
import SalesAndTrendsLabel from "../pages/Label/SalesAndTrends";
import PayoutsLabel from "../pages/Label/Payouts";
import StatementLabel from "../pages/Label/Statements";
import RevenueUploadLabel from "../pages/Label/RevenueUpload";
import GeneralSetting from "../pages/Label/GeneralSetting";
import LabelUploadLabel from "../pages/Label/LabelUpload";
import ConversionLabel from "../pages/Label/Conversion";
import LogsLabel from "../pages/Label/Logs";
import BankDetailLabel from "../pages/Label/BankDetail";
import BankDetailFormLabel from "../pages/Label/BankDetailForm";
import LabelSummarySubLabel from "../pages/SubLabel/LabelSummary";
import ContractFormSubLabel from "../pages/SubLabel/ContractForm";
import ContractLogSubLabel from "../pages/SubLabel/ContractLog";
import SubLabelSummarySubLabel from "../pages/SubLabel/SubLabelSummary";
import ArtistSubLabel from "../pages/SubLabel/Artist";
import UserManagementSubLabel from "../pages/SubLabel/UserManagement";
import ReleasesSubLabel from "../pages/SubLabel/Releases";
import RevenueReportsSubLabel from "../pages/SubLabel/RevenueReports";
import SalesAndTrendsSubLabel from "../pages/SubLabel/SalesAndTrends";
import PayoutsSubLabel from "../pages/SubLabel/Payouts";
import StatementSubLabel from "../pages/SubLabel/Statements";
import RevenueUploadSubLabel from "../pages/SubLabel/RevenueUpload";
import GeneralSettingSubLabel from "../pages/SubLabel/GeneralSetting";
import LabelUploadSubLabel from "../pages/SubLabel/LabelUpload";
import ConversionSubLabel from "../pages/SubLabel/Conversion";
import LogsSubLabel from "../pages/SubLabel/Logs";
import BankDetailSubLabel from "../pages/SubLabel/BankDetail";
import BankDetailFormSubLabel from "../pages/SubLabel/BankDetailForm";
import AllRevenue from "../pages/SuperAdmin/AllRevenue";
import AddPayout from "../pages/SuperAdmin/AddPayout";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route
          element={
            <PublicRoute>
              <AuthLayout />
            </PublicRoute>
          }
        >
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* SUPERADMIN ROUTES */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["Super Admin"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/superadmin" element={<SuperAdminDashboard />} />
          <Route path="/superadmin/artist" element={<Artist />} />
          <Route path="/superadmin/user-management" element={<UserManagement />} />
          <Route path="/superadmin/releases" element={<Releases />} />
          <Route path="/superadmin/revenue-reports" element={<RevenueReports />} />
          <Route path="/superadmin/salesAndTrends" element={<SalesAndTrends />} />
          <Route path="/superadmin/payouts" element={<Payouts />} />
          <Route path="/superadmin/statements" element={<Statements />} />
          <Route path="/superadmin/revenue-upload" element={<RevenueUpload />} />
          <Route path="/superadmin/setting" element={<Setting />} />
          <Route path="/superadmin/label-summary" element={<LabelSummary />} />
          <Route path="/superadmin/sub-label-summary/:userId" element={<SubLabelSummary />} />
          <Route path="/superadmin/label-upload" element={<LabelUpload />} />
          <Route path="/superadmin/conversion" element={<Conversion />} />
          <Route path="/superadmin/logs" element={<Logs />} />
          <Route path="/superadmin/sub-label/:userId" element={<SubLabel />} />
          <Route path="/superadmin/artist-details/:userId" element={<ArtistDetail />} />
          <Route path="/superadmin/add-user" element={<AddUser />} />
          <Route path="/superadmin/bank-details" element={<BankDetail />} />
          <Route path="/superadmin/bank-details-form" element={<BankDetailForm />} />
          <Route path="/superadmin/bank-details-form/:id" element={<BankDetailForm />} />
          <Route path="/superadmin/contract" element={<Contract />} />
          <Route path="/superadmin/contract-from" element={<ContractForm />} />
          <Route path="/superadmin/contract-from/:id" element={<ContractForm />} />
          <Route path="/superadmin/contract-logs/:id" element={<ContractLog />} />
          <Route path="/superadmin/revenues/:userId" element={<AllRevenue />} />
          <Route path="/superadmin/payout-from" element={<AddPayout />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* MANAGER ROUTES */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["Manager"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/manager" element={<ManagerDashboard />} />
        </Route>


        {/* LABEL ROUTES */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["Label"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/label" element={<LabelDashboard />} />
          <Route path="/label/label-summary" element={<LabelSummaryLabel />} />
          <Route path="/label/contract-from" element={<ContractFormLabel />} />
          <Route path="/label/contract-from/:id" element={<ContractFormLabel />} />
          <Route path="/label/contract-logs/:id" element={<ContractLogLabel />} />
          <Route path="/label/sub-label-summary/:userId" element={<SubLabelSummaryLabel />} />
          <Route path="/label/artist" element={<ArtistLabel />} />
          <Route path="/label/user-management" element={<UserManagementLabel />} />
          <Route path="/label/releases" element={<ReleasesLabel />} />
          <Route path="/label/revenue-reports" element={<RevenueReportsLabel />} />
          <Route path="/label/salesAndTrends" element={<SalesAndTrendsLabel />} />
          <Route path="/label/payouts" element={<PayoutsLabel />} />
          <Route path="/label/statements" element={<StatementLabel />} />
          <Route path="/label/revenue-upload" element={<RevenueUploadLabel />} />
          <Route path="/label/setting" element={<GeneralSetting />} />
          <Route path="/label/label-upload" element={<LabelUploadLabel />} />
          <Route path="/label/conversion" element={<ConversionLabel />} />
          <Route path="/label/logs" element={<LogsLabel />} />
          <Route path="/label/bank-details" element={<BankDetailLabel />} />
          <Route path="/label/bank-details-form" element={<BankDetailFormLabel />} />
          <Route path="/label/bank-details-form/:id" element={<BankDetailFormLabel />} />
        </Route>


        {/* SUB LABEL ROUTES */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["Sub Label"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/sub-label" element={<SubLabelDashboard />} />
          <Route path="/sub-label/label-summary" element={<LabelSummarySubLabel />} />
          <Route path="/sub-label/contract-from" element={<ContractFormSubLabel />} />
          <Route path="/sub-label/contract-from/:id" element={<ContractFormSubLabel />} />
          <Route path="/sub-label/contract-logs/:id" element={<ContractLogSubLabel />} />
          <Route path="/sub-label/sub-label-summary/:userId" element={<SubLabelSummarySubLabel />} />
          <Route path="/sub-label/artist" element={<ArtistSubLabel />} />
          <Route path="/sub-label/user-management" element={<UserManagementSubLabel />} />
          <Route path="/sub-label/releases" element={<ReleasesSubLabel />} />
          <Route path="/sub-label/revenue-reports" element={<RevenueReportsSubLabel />} />
          <Route path="/sub-label/salesAndTrends" element={<SalesAndTrendsSubLabel />} />
          <Route path="/sub-label/payouts" element={<PayoutsSubLabel />} />
          <Route path="/sub-label/statements" element={<StatementSubLabel />} />
          <Route path="/sub-label/revenue-upload" element={<RevenueUploadSubLabel />} />
          <Route path="/sub-label/setting" element={<GeneralSettingSubLabel />} />
          <Route path="/sub-label/label-upload" element={<LabelUploadSubLabel />} />
          <Route path="/sub-label/conversion" element={<ConversionSubLabel />} />
          <Route path="/sub-label/logs" element={<LogsSubLabel />} />
          <Route path="/sub-label/bank-details" element={<BankDetailSubLabel />} />
          <Route path="/sub-label/bank-details-form" element={<BankDetailFormSubLabel />} />
          <Route path="/sub-label/bank-details-form/:id" element={<BankDetailFormSubLabel />} />
        </Route>


        {/*  CHANGE PASSWORD FOR ALL LOGGED USERS  */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["Super Admin", "Admin", "Manager", "Label", "Sub Label"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>

  );
}

export default AppRouter;
