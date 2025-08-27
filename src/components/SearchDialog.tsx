import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, User, Building2, Heart, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = [
    { type: 'donor', title: 'osei kelvin (O+)', subtitle: 'Available donor', icon: User, link: '/donor-portal' },
    { type: 'hospital', title: 'Morro Hospital', subtitle: 'Active requests: 3', icon: Building2, link: '/hospital-portal' },
    { type: 'request', title: 'Emergency Request #1234', subtitle: 'A+ Blood needed urgently', icon: Heart, link: '/emergency-requests' },
    { type: 'report', title: 'Monthly Donation Report', subtitle: 'January 2024', icon: FileText, link: '/reports' },
  ].filter(item => 
    searchTerm === '' || 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search donors, hospitals, requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <Link
                  key={index}
                  to={result.link}
                  onClick={() => onOpenChange(false)}
                  className="block"
                >
                  <Button variant="ghost" className="w-full justify-start h-auto p-3">
                    <result.icon className="h-4 w-4 mr-3 text-muted-foreground" />
                    <div className="text-left">
                      <div className="font-medium">{result.title}</div>
                      <div className="text-sm text-muted-foreground">{result.subtitle}</div>
                    </div>
                  </Button>
                </Link>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                {searchTerm ? 'No results found' : 'Start typing to search...'}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};