import { useState, useEffect } from "react";
import Button from "../components/UI/Button";
import OptionsContainer from "../components/UI/OptionsContainer";
import {
  useGetPermissionsQuery,
  useGetRolesPermissionsQuery,
  useGetRolesQuery,
  useUpdateRolePermissionsMutation,
} from "../services/api/userSlice";
import CustomTable from "../components/UI/CustomTable";
import RoleCreationModal from "../components/Login/RoleCreationModal";
import SkeletonTable from "../components/Loading/SkeletonTable";

function ManageRoles() {
  const {
    data: roles,
    isLoading: rolesLoading,
    isError: isRolesError,
  } = useGetRolesQuery("roles");

  const {
    data: permissionsData,
    isLoading: permissionLoading,
    isError: isPermissionError,
  } = useGetPermissionsQuery("permission");

  const {
    data:rolesPermissions , 
    isLoading:isRolePermisson,
    isError:IsRPError , 
    error:errorPR
  } = useGetRolesPermissionsQuery("role-permissions")

  const [updateRolePermissions, { isLoading: isSaving }] =
    useUpdateRolePermissionsMutation();

  const [matrix, setMatrix] = useState<Record<number, Set<number>>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);



// ✅ CORRECT — useEffect first, guard after
useEffect(() => {
  if (!rolesPermissions) return;
  const initial: Record<number, Set<number>> = {};
  rolesPermissions.forEach((item: any) => {
    if (initial[item.role_id]) {
      initial[item.role_id].add(item.permission_id);
    } else {
      const newSet = new Set<number>();
      initial[item.role_id] = newSet.add(item.permission_id);
    }
  });
  setMatrix(initial);
}, [rolesPermissions]); // also fix dep: should be rolesPermissions, not roles

// Now safe to early return
if (isRolePermisson) {
  return <OptionsContainer><SkeletonTable /></OptionsContainer>;
}

  function handleToggle(roleId: number, permissionId: number) {
    setSaveSuccess(false);
    setSaveError(null);
    setMatrix((prev) => {
      const current = new Set(prev[roleId]);
      current.has(permissionId)
        ? current.delete(permissionId)
        : current.add(permissionId);
      return { ...prev, [roleId]: current };
    });
  }

  async function handleSave() {
    if (!roles) return;
    setSaveError(null);
    setSaveSuccess(false);
    try {
      // save all roles in parallel
      await Promise.all(
        roles.map((role: any) =>
          updateRolePermissions({
            role_id: role.id,
            permission_id: Array.from(matrix[role.id] ?? []),
          }).unwrap()
        )
      );
      setSaveSuccess(true);
    } catch (err: any) {
      setSaveError(err?.data?.detail ?? "Failed to save permissions.");
    }
  }

  // Permission name column + one column per role
  const columns = [
    {
      key: "name",
      label: "Permission",
      render: (_: any, row: any) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">{row.name}</span>
          {row.description && (
            <span className="text-xs text-gray-400 mt-0.5">{row.description}</span>
          )}
        </div>
      ),
    },
    ...(roles ?? []).map((role: any) => ({
      key: `role_${role.id+role.name}`,
      label: role.name,
      render: (_: any, row: any) => (
        <input
          type="checkbox"
          className="w-6 h-6 accent-black cursor-pointer rounded-xl"
          checked={matrix[role.id]?.has(row.id) ?? false}
          onChange={() => handleToggle(role.id, row.id)}
        />
      ),
    })),
  ];

  // Full page loading
  if (rolesLoading || permissionLoading) {
    return (
      <OptionsContainer>
        <div className="flex items-center justify-center h-64 gap-3 text-gray-500">
          <svg className="animate-spin w-5 h-5 shrink-0" viewBox="0 0 15 15" fill="none">
            <circle cx="7.5" cy="7.5" r="6" strokeWidth="2" className="stroke-gray-200" />
            <path d="M7.5 1.5a6 6 0 0 1 6 6" strokeWidth="2" strokeLinecap="round" className="stroke-gray-500" />
          </svg>
          <span className="text-sm">Loading roles and permissions…</span>
        </div>
      </OptionsContainer>
    );
  }

  // Full page error
  if (isRolesError || isPermissionError) {
    return (
      <OptionsContainer>
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Failed to load data</p>
            <p className="text-xs text-gray-500 mt-1">
              {isRolesError ? "Could not fetch roles. " : ""}
              {isPermissionError ? "Could not fetch permissions." : ""}
            </p>
          </div>
          <Button variant="outline" text="Retry" onClick={() => window.location.reload()} />
        </div>
      </OptionsContainer>
    );
  }

  return (
    <OptionsContainer>
      <div className="p-8">
        <RoleCreationModal isOpen={isOpen} setIsOpen={setIsOpen} title="Create a New Role" />

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Roles</h1>
            <p className="text-sm text-gray-500 mt-2">Configure role permissions</p>
          </div>
          <Button text="+ Create Role" variant="primary" onClick={() => setIsOpen(true)} />
        </div>

        {/* Permission matrix panel */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden">

          {/* Panel header */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Permission Matrix</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Toggle permissions per role, then hit Save Changes
                </p>
              </div>
              <Button
                text="Save Changes"
                variant="primary"
                isLoading={isSaving}
                loadingText="Saving…"
                onClick={handleSave}
              />
            </div>

            {saveSuccess && (
              <div className="mt-4 flex items-center gap-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M5.5 8l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                All role permissions saved successfully.
              </div>
            )}

            {saveError && (
              <div className="mt-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {saveError}
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {permissionsData?.permissions?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-2">
                <p className="text-sm font-medium text-gray-900">No permissions found</p>
                <p className="text-xs text-gray-400">Create permissions first to assign them to roles.</p>
              </div>
            ) : (
              <CustomTable columns={columns} data={permissionsData?.permissions ?? []} />
            )}
          </div>

        </div>
      </div>
    </OptionsContainer>
  );
}

export default ManageRoles;