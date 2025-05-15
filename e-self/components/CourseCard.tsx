'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { Course } from '../app/types/course';
import { useCart } from '../app/context/CartContext'; // Make sure this path is correct

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const { image, title, category, rating, description, duration, price, id } = course;
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(course);
  };

  return (
    <Card className="w-72 h-[420px] flex flex-col overflow-hidden">
      <div className="relative w-full h-48">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between mb-2">
          <Badge className="bg-[#8E1616]">{category}</Badge>
          <span className="text-sm">⭐ {rating}</span>
        </div>
        <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </CardContent>

      <CardFooter className="p-4 flex flex-col gap-2">
        <div className="w-full flex justify-between text-sm">
          <span>🕒 {duration}h</span>
          <strong>${price}</strong>
        </div>
        <div className="w-full flex justify-between gap-2">
          <Link href={`/courses/${id}`} className="w-1/2">
            <Button className="w-full bg-[#8E1616] hover:bg-[#D84040]" size="sm">Details</Button>
          </Link>
          <Button onClick={handleAddToCart} className="w-1/2 bg-[#8e4c16] hover:bg-[#d8aa40]" size="sm">
            Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
