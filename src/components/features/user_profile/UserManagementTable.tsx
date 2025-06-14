import { useEffect, useState } from 'react';
import { FaGithub, FaGoogle, FaLinkedin } from 'react-icons/fa6';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { toast } from 'sonner';

import MotionDeleteButton from '@/components/motion_components/MotionDeleteButton';
import Loading from '@/components/shared/Loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserResponse, UsersResponseSchema } from '@/schema/schema_users';
import { deleteUser } from '@/services/service_auth';
import { getUsers } from '@/services/service_user';

// A component to manage user accounts, displaying a table of users with options to delete them.
// Emoji is used for fun.
const UserManagementTable = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  // Load the users data when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        const validated = UsersResponseSchema.safeParse(res.data);
        if (!validated.success) {
          console.error('Invalid users response:', JSON.stringify(validated.error));
          toast.error('Failed to fetch users, please try again later.');
          return;
        }
        setUsers(validated.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast.error('Failed to fetch users, please try again later.');
      }
    };

    fetchUsers();
  }, []);

  // Handler for deleting a user
  const handleDeleteUser = async (userId: string) => {
    if (!userId) return;
    setLoadingUserId(userId);
    try {
      await deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      toast.success('User deleted successfully!');
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user, please try again later.');
    } finally {
      setLoadingUserId(null);
    }
  };

  // The column definitions for the user management table
  const columns: ColumnDef<UserResponse>[] = [
    {
      accessorKey: 'username',
      header: 'Username',
    },
    {
      accessorKey: 'avatarUrl',
      header: 'Avatar',
      cell: ({ row }) => (
        <div className='flex justify-center'>
          <Avatar className='h-6 w-6'>
            <AvatarImage
              src={row.getValue('avatarUrl')}
              alt={`${row.getValue('username')}'s avatar`}
            />
            <AvatarFallback>{(row.getValue('username') as string)[0] ?? 'U'}</AvatarFallback>
          </Avatar>
        </div>
      ),
    },
    {
      accessorKey: 'oauthProviders',
      header: 'OAuth Providers',
      cell: ({ row }) => {
        const providers = row.getValue('oauthProviders') as string[];
        return (
          <div className='flex justify-center gap-1.5'>
            {providers.includes('google') && <FaGoogle key='google' className='h-6 w-6' />}
            {providers.includes('github') && <FaGithub key='github' className='h-6 w-6' />}
            {providers.includes('linkedin') && <FaLinkedin key='linkedin' className='h-6 w-6' />}
          </div>
        );
      },
    },
    {
      accessorKey: 'isAdmin',
      header: 'Role',
      cell: ({ row }) => <span className='text-lg'>{row.getValue('isAdmin') ? '👑' : '👤'}</span>,
    },
    {
      accessorKey: 'hasPassword',
      header: 'Has Password',
      cell: ({ row }) => (row.getValue('hasPassword') ? '✅' : '❌'),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleDateString(),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated At',
      cell: ({ row }) => new Date(row.getValue('updatedAt')).toLocaleDateString(),
    },
    {
      accessorKey: 'consentAt',
      header: 'Consent At',
      cell: ({ row }) => new Date(row.getValue('consentAt')).toLocaleDateString(),
    },
    {
      accessorKey: 'id',
      header: 'Operation',
      cell: ({ row }) => (
        <MotionDeleteButton
          deleteItem={`User ${row.getValue('username')}`}
          supportingText={`Delete Account ${row.getValue('username')}`}
          textOrIcon='icon'
          deleteHandler={() => handleDeleteUser(row.getValue('id'))}
          size='sm'
          isLoading={loadingUserId === row.getValue('id')}
        />
      ),
    },
  ];

  // Init a table
  const table = useReactTable<UserResponse>({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // It is impossible to have no users in the database, bc at least the logged-in user exists:)
  if (users.length === 0) return <Loading />;

  return (
    <div className='mt-5 rounded-md'>
      <Table className='min-w-full'>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className='px-3 py-2 text-center'>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className='hover:bg-muted'>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className='px-3 py-2 text-center'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserManagementTable;
