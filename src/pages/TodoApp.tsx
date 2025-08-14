import { useState } from 'react';
import { Todo } from '@/types/todo';
import { useTodos } from '@/hooks/useTodos';
import { TodoCard } from '@/components/TodoCard';
import { TodoForm } from '@/components/TodoForm';
import { PillNav } from '@/components/PillNav';
import PillNavBits from '@/components/PillNavBits';
import BlurText from '@/components/BlurText';
import { TodoStats } from '@/components/TodoStats';
import { Button } from '@/components/ui/button';
import ClickSpark from '@/components/ClickSpark';
import ShinyText from '@/components/ShinyText';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const TodoApp = () => {
  const {
    todos,
    filter,
    setFilter,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
    stats,
    isLoading,
  } = useTodos();
  
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>();

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleFormSubmit = (data: any) => {
    if (editingTodo) {
      updateTodo(editingTodo.id, data);
    } else {
      addTodo(data);
    }
    setShowForm(false);
    setEditingTodo(undefined);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTodo(undefined);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <TodoForm
            editingTodo={editingTodo}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <ClickSpark
      sparkColor="#000000"
      sparkSize={8}
      sparkRadius={20}
      sparkCount={12}
      duration={420}
      className="min-h-screen bg-dot-grid"
    >
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
        {/** Use Hacktiv8 logo for pill nav logo */}

        {/* Top Title - Blur Text with ClickSpark */}
        <ClickSpark sparkColor="#000000" sparkSize={10} sparkRadius={18} sparkCount={10} duration={420}>
          <BlurText
            text="TO DO APP"
            delay={150}
            animateBy="letters"
            direction="top"
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center"
          />
        </ClickSpark>
        <div className="text-center -mt-2">
          <ShinyText text="Created by KALL" speed={3} className="text-base md:text-lg lg:text-xl" />
        </div>

        {/* Stats */}
        <div className="animate-slide-up">
          <TodoStats stats={stats} />
        </div>

        {/* Controls */}
        <Card className="bg-gradient-card border-border/50 shadow-card animate-slide-up">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-3">
                <CardTitle className="text-xl font-semibold">Task Management</CardTitle>
                <div className="mt-1">
                  {/** remote hacktiv8 logo */}
                  <PillNavBits
                    logo={"https://tse4.mm.bing.net/th/id/OIP.FBkTX3uXaCK1Det6nKzYbwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"}
                    items={[
                      { label: 'All Tasks', href: '/' },
                      { label: 'Active Tasks', href: '/active' },
                      { label: 'Completed Tasks', href: '/completed' },
                    ]}
                    activeHref={
                      filter === 'all' ? '/' : filter === 'active' ? '/active' : '/completed'
                    }
                    className="max-w-full"
                    baseColor="#000000"
                    pillColor="#ffffff"
                    hoveredPillTextColor="#ffffff"
                    onItemClick={(item) => {
                      if (item.href === '/') setFilter('all');
                      else if (item.href === '/active') setFilter('active');
                      else if (item.href === '/completed') setFilter('completed');
                    }}
                  />
                </div>
              </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <ClickSpark sparkColor="#000000" sparkSize={8} sparkRadius={14} sparkCount={8} duration={360}>
                   <Button
                  onClick={() => setShowForm(true)}
                  className="flex-1 sm:flex-none bg-gradient-primary hover:opacity-90 transition-all duration-200 shadow-elegant"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                 </Button>
                  </ClickSpark>
                {stats.completed > 0 && (
                  <ClickSpark sparkColor="#000000" sparkSize={6} sparkRadius={12} sparkCount={8} duration={320}>
                  <Button
                    variant="outline"
                    onClick={clearCompleted}
                    className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear
                   </Button>
                  </ClickSpark>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent></CardContent>
        </Card>

        {/* Tasks List */}
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {filter === 'all' && 'All Tasks'}
              {filter === 'active' && 'Active Tasks'}
              {filter === 'completed' && 'Completed Tasks'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todos.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  {filter === 'completed' && stats.completed === 0 && 'No completed tasks yet'}
                  {filter === 'active' && stats.active === 0 && 'No active tasks'}
                  {filter === 'all' && stats.total === 0 && 'No tasks yet'}
                </h3>
                <p className="text-muted-foreground/70">
                  {filter === 'all' && stats.total === 0 && 'Create your first task to get started!'}
                  {filter === 'completed' && stats.completed === 0 && 'Complete some tasks to see them here.'}
                  {filter === 'active' && stats.active === 0 && 'All tasks are completed! 🎉'}
                </p>
              </div>
            ) : (
              <ScrollArea className="max-h-[600px]">
                <div className="space-y-3">
                  {todos.map((todo) => (
                    <div key={todo.id}>
                      <TodoCard
                        todo={todo}
                        onToggle={toggleTodo}
                        onEdit={handleEdit}
                        onDelete={deleteTodo}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        {stats.total > 0 && (
          <div className="text-center text-sm text-muted-foreground animate-fade-in">
            You have {stats.active} active task{stats.active !== 1 ? 's' : ''} remaining
          </div>
        )}
        </div>
      </div>
    </ClickSpark>
  );
};