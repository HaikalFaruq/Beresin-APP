import { useState, useEffect } from 'react';
import { Todo, TodoFilter, TodoFormData } from '@/types/todo';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'todo-app-tasks';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load todos from localStorage on mount
  useEffect(() => {
    try {
      const savedTodos = localStorage.getItem(STORAGE_KEY);
      if (savedTodos) {
        setTodos(JSON.parse(savedTodos));
      }
    } catch (error) {
      console.error('Error loading todos from localStorage:', error);
      toast({
        title: "Error",
        description: "Failed to load your tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      } catch (error) {
        console.error('Error saving todos to localStorage:', error);
        toast({
          title: "Error",
          description: "Failed to save your tasks. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [todos, isLoading, toast]);

  const addTodo = (todoData: TodoFormData) => {
    const newTodo: Todo = {
      ...todoData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTodos(prev => [newTodo, ...prev]);
    
    toast({
      title: "Task Created",
      description: `"${newTodo.title}" has been added to your tasks.`,
      className: "bg-gradient-success border-success/20",
    });
  };

  const updateTodo = (id: string, updates: Partial<TodoFormData>) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id 
          ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
          : todo
      )
    );

    const todo = todos.find(t => t.id === id);
    toast({
      title: "Task Updated",
      description: `"${todo?.title}" has been updated.`,
      className: "bg-gradient-primary border-primary/20",
    });
  };

  const deleteTodo = (id: string) => {
    const todo = todos.find(t => t.id === id);
    setTodos(prev => prev.filter(todo => todo.id !== id));
    
    toast({
      title: "Task Deleted",
      description: `"${todo?.title}" has been removed.`,
      variant: "destructive",
    });
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => 
      prev.map(todo => {
        if (todo.id === id) {
          const updatedTodo = { 
            ...todo, 
            completed: !todo.completed,
            updatedAt: new Date().toISOString()
          };
          
          toast({
            title: updatedTodo.completed ? "Task Completed!" : "Task Reopened",
            description: `"${updatedTodo.title}" ${updatedTodo.completed ? 'marked as complete' : 'marked as active'}.`,
            className: updatedTodo.completed ? "bg-gradient-success border-success/20" : "bg-gradient-primary border-primary/20",
          });
          
          return updatedTodo;
        }
        return todo;
      })
    );
  };

  const clearCompleted = () => {
    const completedCount = todos.filter(t => t.completed).length;
    setTodos(prev => prev.filter(todo => !todo.completed));
    
    toast({
      title: "Completed Tasks Cleared",
      description: `${completedCount} completed task${completedCount !== 1 ? 's' : ''} removed.`,
      variant: "destructive",
    });
  };

  // Filtered todos based on current filter
  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  // Statistics
  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
  };

  return {
    todos: filteredTodos,
    filter,
    setFilter,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
    stats,
    isLoading,
  };
};