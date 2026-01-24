import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SessionReviewHeaderProps {
  childName: string;
  childAge: number | null;
  childGender: string | null;
}

export function SessionReviewHeader({
  childName,
  childAge,
  childGender,
}: SessionReviewHeaderProps) {
  const navigate = useNavigate();

  const formatGender = (gender: string | null): string => {
    if (!gender) return '';
    switch (gender.toLowerCase()) {
      case 'male':
      case 'm':
        return 'Fant';
      case 'female':
      case 'f':
        return 'Punca';
      default:
        return gender;
    }
  };

  const formatAge = (age: number | null): string => {
    if (!age) return '';
    if (age === 1) return '1 leto';
    if (age === 2) return '2 leti';
    if (age >= 3 && age <= 4) return `${age} leta`;
    return `${age} let`;
  };

  return (
    <div className="bg-card border rounded-lg p-4 md:p-6 space-y-4">
      {/* Nazaj gumb */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/admin/my-reviews')}
        className="gap-2 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Nazaj na moje preglede
      </Button>

      {/* Naslov */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pregled preverjanja izgovorjave</h1>
      </div>

      {/* Podatki otroka */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-foreground">{childName}</span>
          {childGender && (
            <span className="text-muted-foreground">({formatGender(childGender)})</span>
          )}
        </div>

        {childAge && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{formatAge(childAge)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
