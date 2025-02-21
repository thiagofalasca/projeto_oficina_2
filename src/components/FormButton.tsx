import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Loader2 } from 'lucide-react';

interface FormButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
}

const FormButton: React.FC<FormButtonProps> = ({ isLoading, children }) => (
  <Button type="submit" disabled={isLoading} className="form-btn">
    {isLoading ? (
      <>
        <Loader2 size={20} className="animate-spin" /> Carregando...
      </>
    ) : (
      <>
        {children}
        <ArrowRightIcon />
      </>
    )}
  </Button>
);

export default FormButton;
