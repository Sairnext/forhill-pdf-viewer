import { useState, useEffect } from "react";
import { Circle, CircleCheck } from "lucide-react";

import { BulletWrapper, Label } from "@common/styled/bullet.tsx";

interface Props {
  label: string;

  onClick?: (item: string, active: boolean) => void;
  active?: boolean;
}

export const Bullet: React.FC<Props> = ({ label, onClick, active }) => {
  const [isActive, setIsActive] = useState(active);

  const handleClick = () => {
    if (onClick) {
      onClick?.(label, !isActive);

      setIsActive(!isActive);
    }
  };

  useEffect(() => {
    setIsActive(!!active);
  }, [active]);

  return (
    <BulletWrapper onClick={handleClick}>
      <Label>{label}</Label>
      {isActive ? <CircleCheck size={22} /> : <Circle size={22} />}
    </BulletWrapper>
  );
};
