export const Routes = {
  Home: '/',
  Debug: '/debug',
  List: (id: string) => ({
    pathname: '/lists/[id]' as const,
    params: { id },
  }),
  TaskModal: '/(modals)/task',
}
