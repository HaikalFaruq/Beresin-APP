import { useState } from 'react';
import { Todo } from '@/types/todo';
import { useTodos } from '@/hooks/useTodos';
import { TodoCard } from '@/components/TodoCard';
import { TodoForm } from '@/components/TodoForm';
import { TodoFilters } from '@/components/TodoFilters';
import { TodoStats } from '@/components/TodoStats';
import { Button } from '@/components/ui/button';
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
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            My Tasks
          </h1>
          <p className="text-lg text-muted-foreground">
            Stay organized and get things done
          </p>
        </div>

        {/* Stats */}
        <div className="animate-slide-up">
          <TodoStats stats={stats} />
        </div>

        {/* Controls */}
        <Card className="bg-gradient-card border-border/50 shadow-card animate-slide-up">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-xl font-semibold">Task Management</CardTitle>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  onClick={() => setShowForm(true)}
                  className="flex-1 sm:flex-none bg-gradient-primary hover:opacity-90 transition-all duration-200 shadow-elegant"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
                {stats.completed > 0 && (
                  <Button
                    variant="outline"
                    onClick={clearCompleted}
                    className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <TodoFilters
              currentFilter={filter}
              onFilterChange={setFilter}
              stats={stats}
            />
          </CardContent>
        </Card>

        {/* Tasks List */}
        <Card className="bg-gradient-card border-border/50 shadow-card animate-slide-up">
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
                  {todos.map((todo, index) => (
                    <div
                      key={todo.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
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
  );
};