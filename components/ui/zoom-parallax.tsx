'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

interface Image {
	src: string;
	alt?: string;
}

interface ZoomParallaxProps {
	/** Array of images to be displayed in the parallax effect */
	images: Image[];
}

export function ZoomParallax({ images }: ZoomParallaxProps) {
	const container = useRef(null);
	const { scrollYProgress } = useScroll({
		target: container,
		offset: ['start start', 'end end'],
	});

	const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
	const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
	const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
	const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
	const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

	const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

	const getPositionClass = (index: number) => {
		const mod = index % 14;
		switch (mod) {
			case 1: return '[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]';
			case 2: return '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]';
			case 3: return '[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]';
			case 4: return '[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]';
			case 5: return '[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]';
			case 6: return '[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]';
			case 7: return '[&>div]:!-top-[35vh] [&>div]:!-left-[20vw] [&>div]:!h-[20vh] [&>div]:!w-[20vw]';
			case 8: return '[&>div]:!-top-[25vh] [&>div]:!left-[30vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]';
			case 9: return '[&>div]:!top-[10vh] [&>div]:!-left-[32vw] [&>div]:!h-[35vh] [&>div]:!w-[18vw]';
			case 10: return '[&>div]:!top-[32vh] [&>div]:!left-[20vw] [&>div]:!h-[20vh] [&>div]:!w-[25vw]';
			case 11: return '[&>div]:!top-[30vh] [&>div]:!-left-[10vw] [&>div]:!h-[25vh] [&>div]:!w-[22vw]';
			case 12: return '[&>div]:!-top-[5vh] [&>div]:!left-[35vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]';
			case 13: return '[&>div]:!-top-[20vh] [&>div]:!-left-[35vw] [&>div]:!h-[20vh] [&>div]:!w-[22vw]';
			default: return ''; // Slot 0 is default center positioning
		}
	};

	return (
		<div ref={container} className="relative h-[300vh]">
			<div className="sticky top-0 h-screen overflow-hidden">
				{images.map(({ src, alt }, index) => {
					const scale = scales[index % scales.length];

					return (
						<motion.div
							key={index}
							style={{ scale }}
							className={`absolute top-0 flex h-full w-full items-center justify-center ${getPositionClass(index)}`}
						>
							<div className="relative h-[25vh] w-[25vw]">
								<img
									src={src || '/placeholder.svg'}
									alt={alt || `Parallax image ${index + 1}`}
									className="h-full w-full object-cover"
								/>
							</div>
						</motion.div>
					);
				})}
			</div>
		</div>
	);
}
