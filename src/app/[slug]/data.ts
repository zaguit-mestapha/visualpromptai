export interface ModelPrompt {
  text: string;
  category: "portraits" | "landscapes" | "products" | "abstract" | "cinematic";
}

export interface ModelPageData {
  slug: string;
  modelName: string;
  title: string;
  description: string;
  metaDescription: string;
  keywords: string[];
  intro: string;
  features: string[];
  prompts: ModelPrompt[];
}

const CATEGORIES_LABEL: Record<string, string> = {
  portraits: "Portraits & Characters",
  landscapes: "Landscapes & Environments",
  products: "Products & Still Life",
  abstract: "Abstract & Conceptual",
  cinematic: "Cinematic & Scenes",
};

export { CATEGORIES_LABEL };

export const MODEL_PAGES: ModelPageData[] = [
  {
    slug: "midjourney-prompts",
    modelName: "Midjourney",
    title: "Best Midjourney Prompts 2026 - Free Generator & Optimizer",
    description: "Discover the best Midjourney prompts for stunning AI art.",
    metaDescription:
      "Browse 20 curated Midjourney prompts across portraits, landscapes, products, abstract, and cinematic styles. Copy, optimize, and generate stunning AI art for free.",
    keywords: [
      "midjourney prompts",
      "best midjourney prompts 2026",
      "midjourney prompt generator",
      "midjourney v6 prompts",
      "midjourney art prompts",
      "free midjourney prompts",
    ],
    intro:
      "Midjourney is renowned for its painterly aesthetic and exceptional understanding of artistic styles. It excels at photorealistic imagery, fantasy art, and complex compositions. These curated prompts are optimized for Midjourney v6 and include style parameters for the best results.",
    features: [
      "Best-in-class artistic interpretation",
      "Supports --ar, --v, and --style parameters",
      "Excellent at photorealism and fantasy",
      "Strong understanding of lighting and mood",
    ],
    prompts: [
      { text: "Portrait of a weathered fisherman at golden hour, deep wrinkles telling stories of the sea, salt-crusted beard, piercing blue eyes reflecting ocean light, shot on Hasselblad --ar 2:3 --v 6.1 --style raw", category: "portraits" },
      { text: "Ethereal elven queen with silver hair flowing in cosmic wind, bioluminescent crown of living crystals, otherworldly beauty, porcelain skin with subtle galaxy freckles --ar 2:3 --v 6.1", category: "portraits" },
      { text: "Street photographer self-portrait reflected in rain puddle, neon city lights creating colorful bokeh, film noir atmosphere, Leica M10 aesthetic --ar 3:4 --v 6.1 --style raw", category: "portraits" },
      { text: "Ancient samurai meditating under cherry blossoms, katana resting across knees, morning mist swirling around weathered armor, zen garden backdrop --ar 2:3 --v 6.1", category: "portraits" },
      { text: "Bioluminescent valley at midnight, glowing mushroom forests stretching to crystal mountains, twin moons reflected in mirror-still lake, ethereal fog --ar 16:9 --v 6.1", category: "landscapes" },
      { text: "Abandoned lighthouse on dramatic cliff edge during electrical storm, massive waves crashing below, single warm light in the window, aerial perspective --ar 16:9 --v 6.1 --style raw", category: "landscapes" },
      { text: "Japanese onsen nestled in snow-covered mountains, steam rising through bamboo forest, warm lantern glow contrasting cold blue twilight --ar 16:9 --v 6.1", category: "landscapes" },
      { text: "Floating island archipelago above cloud sea at sunrise, waterfalls cascading into void, ancient temples connected by rope bridges, volumetric god rays --ar 16:9 --v 6.1", category: "landscapes" },
      { text: "Luxury perfume bottle on black marble surface, single orchid petal, dramatic side lighting creating long shadows, liquid gold reflections, editorial photography --ar 4:5 --v 6.1 --style raw", category: "products" },
      { text: "Artisan sourdough bread loaf on rustic wooden board, steam rising, scattered flour, warm kitchen morning light streaming through window --ar 4:5 --v 6.1 --style raw", category: "products" },
      { text: "Vintage mechanical watch deconstructed, gears and springs floating in perfect arrangement, macro photography, dark background with copper tones --ar 1:1 --v 6.1", category: "products" },
      { text: "Handcrafted ceramic tea set in wabi-sabi style, imperfect glazing, morning dew on the cups, zen minimalism, soft diffused natural light --ar 4:5 --v 6.1 --style raw", category: "products" },
      { text: "Consciousness expanding into fractal dimensions, human silhouette dissolving into geometric sacred patterns, cosmic colors of nebulae, spiritual transcendence --ar 1:1 --v 6.1", category: "abstract" },
      { text: "Liquid architecture — impossible building made of flowing water frozen in time, refracting light into rainbow caustics, surreal physics --ar 16:9 --v 6.1", category: "abstract" },
      { text: "Time visualized as a river of melting clocks flowing through a desert of hourglasses, Salvador Dali meets modern digital art --ar 16:9 --v 6.1", category: "abstract" },
      { text: "Emotions as weather systems inside a glass sphere, joy as golden sunbeams, sadness as gentle rain, anger as contained lightning --ar 1:1 --v 6.1", category: "abstract" },
      { text: "Film noir detective in rain-soaked alley, neon signs reflecting in puddles, cigarette smoke curling under streetlight, 1940s atmosphere, anamorphic lens --ar 21:9 --v 6.1", category: "cinematic" },
      { text: "Astronaut discovering ancient alien ruins on Mars, massive stone archway covered in glowing hieroglyphics, red dust storm on horizon, Ridley Scott style --ar 21:9 --v 6.1", category: "cinematic" },
      { text: "Last train of the night departing empty platform, single figure watching from bench, rain on glass roof creating light patterns, melancholic beauty --ar 21:9 --v 6.1 --style raw", category: "cinematic" },
      { text: "Underwater ballroom scene, elegant dancers in flowing gowns moving through turquoise water, shafts of sunlight from surface above, magical realism --ar 16:9 --v 6.1", category: "cinematic" },
    ],
  },
  {
    slug: "stable-diffusion-prompts",
    modelName: "Stable Diffusion",
    title: "Best Stable Diffusion Prompts 2026 - Free Generator & Optimizer",
    description: "Discover the best Stable Diffusion prompts for AI art.",
    metaDescription:
      "Browse 20 curated Stable Diffusion prompts with quality tags and negative prompts. Portraits, landscapes, products, abstract, and cinematic categories. Free to copy and optimize.",
    keywords: [
      "stable diffusion prompts",
      "best stable diffusion prompts",
      "SDXL prompts",
      "stable diffusion prompt generator",
      "SD prompt examples",
      "free stable diffusion prompts",
    ],
    intro:
      "Stable Diffusion is the leading open-source AI image generator, offering unmatched customization through fine-tuned models, LoRAs, and ControlNet. These prompts are optimized with quality tags and weighting syntax for SDXL and SD 1.5 checkpoints.",
    features: [
      "Open-source and locally runnable",
      "Supports weighted prompt syntax (word:1.4)",
      "Works with custom models and LoRAs",
      "Negative prompt support for quality control",
    ],
    prompts: [
      { text: "(masterpiece, best quality:1.4), portrait of a cyberpunk hacker, neon-lit face, holographic HUD reflecting in eyes, rain-soaked hair, tech-noir aesthetic, (sharp focus:1.2), studio lighting", category: "portraits" },
      { text: "(masterpiece, best quality:1.4), elegant Victorian lady in botanical garden, golden hour sunlight through greenhouse glass, Pre-Raphaelite painting style, (intricate details:1.3), flowing auburn hair", category: "portraits" },
      { text: "(masterpiece, best quality:1.4), old jazz musician playing saxophone, smoky blue-lit club, soul in every note, close-up portrait, (emotional:1.2), shallow depth of field", category: "portraits" },
      { text: "(masterpiece, best quality:1.4), fierce warrior queen in obsidian armor, battle-scarred and proud, throne room with gothic architecture, volumetric light through stained glass, (detailed face:1.3)", category: "portraits" },
      { text: "(masterpiece, best quality:1.4), enchanted autumn forest with spirit deer, bioluminescent mushrooms lining the path, golden leaves falling in shafts of light, (magical atmosphere:1.3), mist", category: "landscapes" },
      { text: "(masterpiece, best quality:1.4), cyberpunk cityscape at night, towering megastructures, flying vehicles, holographic advertisements, rain-slicked streets reflecting neon, (ultra detailed:1.2)", category: "landscapes" },
      { text: "(masterpiece, best quality:1.4), serene Zen rock garden at dawn, perfectly raked sand patterns, single cherry blossom tree, morning mist, (peaceful composition:1.2), minimalist", category: "landscapes" },
      { text: "(masterpiece, best quality:1.4), massive underground crystal cavern, adventurer with torch revealing prismatic light refractions, subterranean waterfall, sense of discovery, (epic scale:1.3)", category: "landscapes" },
      { text: "(masterpiece, best quality:1.4), luxury sneaker floating in studio, dynamic lighting, smoke and particle effects, premium materials visible, (product photography:1.3), dark background", category: "products" },
      { text: "(masterpiece, best quality:1.4), craft cocktail with molecular gastronomy elements, smoke bubble garnish, crystal clear ice sphere, bar counter with moody lighting, (food photography:1.2)", category: "products" },
      { text: "(masterpiece, best quality:1.4), vintage leather journal with brass clasps, aged parchment pages visible, reading glasses and fountain pen alongside, warm library lighting, (detailed textures:1.3)", category: "products" },
      { text: "(masterpiece, best quality:1.4), gaming headset with RGB lighting, product shot on geometric display, reflective surface, tech aesthetic, (commercial photography:1.2), clean background", category: "products" },
      { text: "(masterpiece, best quality:1.4), synaesthesia visualization, music notes transforming into flowing ribbons of color, sound waves becoming visible architecture, (creative:1.3), vivid palette", category: "abstract" },
      { text: "(masterpiece, best quality:1.4), impossible Escher-inspired staircase city, gravity-defying architecture, people walking in all orientations, mathematical beauty, (surreal:1.3)", category: "abstract" },
      { text: "(masterpiece, best quality:1.4), macro photography of ink drops in water, forming the shape of a dragon, vivid cyan and magenta, black background, (fluid dynamics:1.2)", category: "abstract" },
      { text: "(masterpiece, best quality:1.4), neural network visualization as a living organism, pulsing data streams as glowing synapses, organic circuitry, bio-digital fusion, (detailed:1.3)", category: "abstract" },
      { text: "(masterpiece, best quality:1.4), space opera battle scene, massive fleet engagement near gas giant, weapons fire illuminating ship hulls, cinematic scale, (epic:1.3), dramatic composition", category: "cinematic" },
      { text: "(masterpiece, best quality:1.4), lone cowboy riding through Monument Valley at sunset, dust trail behind horse, dramatic sky with mammatus clouds, Sergio Leone framing, (cinematic:1.3)", category: "cinematic" },
      { text: "(masterpiece, best quality:1.4), heist scene from above, team of specialists navigating laser grid in museum vault, green night-vision aesthetic, tension and precision, (action:1.2)", category: "cinematic" },
      { text: "(masterpiece, best quality:1.4), ghost ship emerging from fog bank at midnight, tattered sails, spectral crew on deck, bioluminescent wake, full moon atmosphere, (horror:1.2), detailed", category: "cinematic" },
    ],
  },
  {
    slug: "dall-e-prompts",
    modelName: "DALL-E",
    title: "Best DALL-E Prompts 2026 - Free Generator & Optimizer",
    description: "Discover the best DALL-E prompts for AI image generation.",
    metaDescription:
      "Browse 20 curated DALL-E 3 prompts for stunning AI images. Natural language prompts for portraits, landscapes, products, abstract art, and cinematic scenes. Free to use.",
    keywords: [
      "DALL-E prompts",
      "best DALL-E 3 prompts",
      "DALL-E prompt generator",
      "ChatGPT image prompts",
      "OpenAI image generation",
      "free DALL-E prompts",
    ],
    intro:
      "DALL-E 3, OpenAI's latest image generation model, excels at understanding natural language descriptions and producing accurate, detailed images. Unlike other models, DALL-E works best with descriptive, conversational prompts rather than keyword lists.",
    features: [
      "Best natural language understanding",
      "Integrated with ChatGPT",
      "Excellent text rendering in images",
      "Strong at following complex instructions",
    ],
    prompts: [
      { text: "Create a photorealistic portrait of a grandmother with kind eyes and silver hair, sitting in a sunlit kitchen, flour on her apron from baking, warm afternoon light creating a halo effect around her hair", category: "portraits" },
      { text: "An editorial fashion photograph of a model wearing an avant-garde outfit made entirely of origami paper cranes, standing in a minimalist white studio, dramatic side lighting", category: "portraits" },
      { text: "A detailed character portrait of a deep-sea diver from the 1920s, brass diving helmet with glowing porthole, barnacles growing on the suit, dark ocean background with bioluminescent creatures", category: "portraits" },
      { text: "A Renaissance-style oil painting portrait of a modern astronaut, combining classical painting techniques with contemporary space exploration themes, rich colors and dramatic chiaroscuro lighting", category: "portraits" },
      { text: "A breathtaking aerial photograph of rice terraces in Southeast Asia during planting season, the fields filled with water reflecting a dramatic sunset sky, creating a mirror effect across the mountainside", category: "landscapes" },
      { text: "An otherworldly landscape of a planet with rings visible in the sky, crystal formations growing from turquoise sand dunes, two suns setting on the horizon casting long purple shadows", category: "landscapes" },
      { text: "A cozy autumn scene of a covered bridge in Vermont, vibrant red and orange foliage reflected in a calm stream below, morning mist rising, a single bicycle leaning against the bridge entrance", category: "landscapes" },
      { text: "A futuristic vertical farm city where skyscrapers are covered in lush green terraces, connecting sky bridges with garden walkways, drones delivering produce, golden hour lighting", category: "landscapes" },
      { text: "A flat lay photograph of a curated desk setup for a creative professional, including a sketchbook with watercolor palette, vintage camera, succulent plants, and artisan coffee, shot from directly above with soft natural light", category: "products" },
      { text: "A stunning product photograph of handmade chocolate truffles arranged on a dark slate board, dusted with cocoa powder and gold leaf, one truffle cut in half revealing a liquid caramel center", category: "products" },
      { text: "An elegant product showcase of a minimalist ceramic vase collection, each piece in a different earth tone, arranged on floating wooden shelves against a textured concrete wall, with single stem flowers", category: "products" },
      { text: "A close-up product photograph of a luxury fountain pen writing on cream-colored paper, ink flowing smoothly, the pen's intricate engravings visible in sharp detail, warm desk lamp lighting", category: "products" },
      { text: "An abstract visualization of the internet as a living organism, data packets as glowing particles flowing through neural pathways, server farms as beating hearts, the whole structure pulsing with digital life", category: "abstract" },
      { text: "A surreal artwork where a grand piano is dissolving into a flock of black birds that fly upward into a twilight sky, each bird carrying a musical note, the boundary between solid and flight", category: "abstract" },
      { text: "An abstract representation of the four seasons occupying four quadrants of a single tree, spring blossoms transitioning to summer green to autumn gold to winter bare branches, each section with its own sky", category: "abstract" },
      { text: "A digital artwork showing the concept of memory, with a person standing in a corridor where doors on each side open to different life moments rendered as vivid dioramas, some doors fading to indicate forgotten memories", category: "abstract" },
      { text: "A dramatic cinematic scene of a lone figure standing at the edge of a massive crater on an alien world, their spacesuit visor reflecting a binary star system, a crashed ship smoking in the crater below", category: "cinematic" },
      { text: "A film still from a noir thriller set in 1970s Tokyo, a detective in a trench coat walking through a rain-soaked market street, paper lanterns reflecting in puddles, shot with anamorphic distortion", category: "cinematic" },
      { text: "A sweeping wide shot of a medieval army preparing for battle at dawn, thousands of soldiers on a misty plain, banners unfurling in the wind, fortress city visible on the distant hill, epic scale", category: "cinematic" },
      { text: "A beautifully composed scene of an old bookshop at closing time, the owner turning off lights one by one, dust motes floating in the last shaft of sunlight, towers of books creating canyons of stories", category: "cinematic" },
    ],
  },
  {
    slug: "flux-prompts",
    modelName: "Flux",
    title: "Best Flux Prompts 2026 - Free Generator & Optimizer",
    description: "Discover the best Flux AI prompts for image generation.",
    metaDescription:
      "Browse 20 curated Flux prompts for high-quality AI images. Optimized prompts for portraits, landscapes, products, abstract art, and cinematic scenes. Free to copy and use.",
    keywords: [
      "Flux prompts",
      "best Flux AI prompts",
      "Flux prompt generator",
      "Flux.1 prompts",
      "Black Forest Labs prompts",
      "free Flux prompts",
    ],
    intro:
      "Flux by Black Forest Labs has quickly become a favorite for its exceptional photorealism and precise prompt following. It handles complex compositions, accurate text rendering, and detailed scenes with remarkable fidelity. These prompts leverage Flux's strengths in detail and coherence.",
    features: [
      "Exceptional photorealism",
      "Accurate text rendering",
      "Precise prompt following",
      "Great at complex multi-subject scenes",
    ],
    prompts: [
      { text: "Editorial portrait of a ballerina mid-pirouette, frozen in perfect form, tutu creating circular motion blur, single spotlight from above, dark theater background, ultra detailed, professional photography", category: "portraits" },
      { text: "Weathered mountain climber at Everest summit, oxygen mask pulled down revealing triumphant smile, prayer flags snapping in wind behind, dramatic altitude clouds below, sharp focus", category: "portraits" },
      { text: "Hyper-detailed portrait of a glassblower at work, molten glass glowing orange on the blowpipe, sweat glistening on focused face, workshop background with finished pieces, natural light", category: "portraits" },
      { text: "Fashion photograph of model in zero-gravity space station, designer gown floating elegantly in microgravity, Earth visible through porthole, editorial lighting, ultra detailed", category: "portraits" },
      { text: "Aerial photograph of the Great Barrier Reef at low tide, intricate coral patterns visible through crystal-clear turquoise water, a single sea turtle gliding below surface, professional photography, sharp focus", category: "landscapes" },
      { text: "Nordic fjord at blue hour, mirror-still water reflecting snow-capped mountains, a single red cabin with warm light glowing from windows, northern lights beginning to appear, ultra detailed", category: "landscapes" },
      { text: "Ancient temple ruins reclaimed by jungle, massive tree roots enveloping stone columns, shafts of light piercing canopy, moss-covered statues half-buried, professional photography, sharp focus", category: "landscapes" },
      { text: "Volcanic landscape at twilight, fresh lava rivers flowing to the ocean creating massive steam clouds, red glow illuminating barren terrain, Milky Way visible above, epic scale", category: "landscapes" },
      { text: "Macro product photograph of mechanical keyboard switches, Cherry MX internals visible through transparent housing, precision engineering details, studio lighting with colored gels, ultra detailed", category: "products" },
      { text: "Flat lay of Japanese bento box with meticulously arranged sushi, each piece a small work of art, chopsticks placed perfectly, wasabi and ginger accents, overhead natural light, professional photography", category: "products" },
      { text: "Luxury watch advertisement showing timepiece submerged in clear water, bubble trail rising from crown, water droplets on crystal, precision engineering visible, commercial photography, sharp focus", category: "products" },
      { text: "Artisan coffee brewing process, pour-over dripper with hot water creating bloom in fresh grounds, steam rising, coffee droplets in macro detail, warm morning kitchen light, ultra detailed", category: "products" },
      { text: "Abstract macro photograph of soap bubbles intersecting, iridescent surfaces creating interference patterns, rainbow colors on impossibly thin membranes, black background, professional photography, sharp focus", category: "abstract" },
      { text: "Data visualization as physical sculpture, streaming information rendered as golden filaments weaving through space, forming neural network patterns, dark environment, volumetric light, ultra detailed", category: "abstract" },
      { text: "Frozen moment of glass shattering, thousands of fragments suspended in air catching prismatic light, the original form still recognizable in the explosion pattern, high-speed photography, sharp focus", category: "abstract" },
      { text: "Bioluminescent deep-sea ecosystem, translucent jellyfish trailing luminous tendrils, anglerfish lanterns in the abyss, alien beauty of deep ocean, underwater photography, ultra detailed", category: "abstract" },
      { text: "Wide cinematic shot of a solitary lighthouse keeper climbing spiral stairs during a hurricane, rain lashing through broken window, lamp mechanism spinning above, dramatic chiaroscuro, professional photography", category: "cinematic" },
      { text: "Post-apocalyptic greenhouse, nature reclaiming a shattered glass structure, wild flowers and vines bursting through, rusty iron frame, shaft of hopeful sunlight, ultra detailed, sharp focus", category: "cinematic" },
      { text: "Golden hour on a Havana street, 1957 Chevrolet Bel Air in turquoise parked against faded pink colonial building, local musicians playing on corner, warm nostalgic atmosphere, professional photography", category: "cinematic" },
      { text: "Aerial view of a massive outdoor music festival at night, sea of lights from audience phones, enormous holographic stage effects, fireworks overhead, city skyline in distance, ultra detailed", category: "cinematic" },
    ],
  },
  {
    slug: "leonardo-ai-prompts",
    modelName: "Leonardo AI",
    title: "Best Leonardo AI Prompts 2026 - Free Generator & Optimizer",
    description: "Discover the best Leonardo AI prompts for stunning AI art.",
    metaDescription:
      "Browse 20 curated Leonardo AI prompts for high-quality image generation. Game assets, concept art, and more across portraits, landscapes, products, abstract, and cinematic styles.",
    keywords: [
      "Leonardo AI prompts",
      "best Leonardo AI prompts",
      "Leonardo AI prompt generator",
      "Leonardo AI art",
      "Leonardo image generation",
      "free Leonardo AI prompts",
    ],
    intro:
      "Leonardo AI specializes in game assets, concept art, and stylized imagery with its suite of fine-tuned models. It offers unique features like real-time canvas generation and texture creation. These prompts are crafted to leverage Leonardo's strengths in stylized and game-ready art.",
    features: [
      "Specialized game asset generation",
      "Multiple fine-tuned art models",
      "Real-time canvas generation",
      "Texture and material creation",
    ],
    prompts: [
      { text: "Game character portrait: elven ranger with emerald eyes, leather armor adorned with forest motifs, quiver of enchanted arrows, misty woodland background | Style: Dynamic | Enhancement: High Detail", category: "portraits" },
      { text: "Concept art portrait: grizzled space marine commander, power armor scarred from countless battles, cybernetic eye glowing red, command bridge background | Style: Cinematic | Enhancement: High Detail", category: "portraits" },
      { text: "Character design: steampunk inventor with brass goggles, wild hair full of small gears and springs, oil-stained workshop apron, warm gaslight illumination | Style: Creative | Enhancement: High Detail", category: "portraits" },
      { text: "Fantasy portrait: ice queen with crystalline crown, frost forming intricate patterns on pale skin, aurora borealis reflected in silver eyes, frozen throne room | Style: Dynamic | Enhancement: High Detail", category: "portraits" },
      { text: "Game environment: enchanted mushroom forest with oversized fungi forming natural archways, fairy lights, crystal streams, magical particle effects, RPG exploration area | Style: Dynamic | Enhancement: High Detail", category: "landscapes" },
      { text: "Concept art landscape: floating city above the clouds, connected by light bridges, waterfall edges cascading into mist below, airships docking at platforms | Style: Cinematic | Enhancement: High Detail", category: "landscapes" },
      { text: "Game level design: underground dwarven forge city, rivers of molten metal, massive anvils and hammers, crystalline ore veins in cavern walls, warm industrial glow | Style: Dynamic | Enhancement: High Detail", category: "landscapes" },
      { text: "Environment concept: bioluminescent alien swamp planet, massive lotus-like plants housing small ecosystems, reflective water, strange fauna silhouettes | Style: Creative | Enhancement: High Detail", category: "landscapes" },
      { text: "Game asset: legendary sword embedded in crystal pedestal, rune engravings glowing blue along the blade, ethereal mist, item showcase style, clean background | Style: Dynamic | Enhancement: High Detail", category: "products" },
      { text: "Concept art item: alchemist potion set with bubbling flasks, colorful liquids, ancient recipe scroll, mystical ingredients, arranged on worn wooden table | Style: Creative | Enhancement: High Detail", category: "products" },
      { text: "Game UI element: ornate treasure chest overflowing with gold coins, gems, and magical artifacts, RPG loot reveal moment, sparkle effects | Style: Dynamic | Enhancement: High Detail", category: "products" },
      { text: "Prop design: futuristic holographic communication device, translucent display showing star map, sleek metallic frame, sci-fi technology aesthetic | Style: Cinematic | Enhancement: High Detail", category: "products" },
      { text: "Concept art: the tree of life connecting all realms, roots in underworld fire, trunk through mortal earth, branches in celestial heavens, mythological epic scene | Style: Dynamic | Enhancement: High Detail", category: "abstract" },
      { text: "Game VFX concept: elemental magic collision, fire meeting ice creating explosive steam and crystal shards, energy waves radiating outward, dark arena background | Style: Dynamic | Enhancement: High Detail", category: "abstract" },
      { text: "Abstract concept: digital consciousness awakening, neural pathways forming from data streams, a face emerging from code, transition from machine to awareness | Style: Creative | Enhancement: High Detail", category: "abstract" },
      { text: "Magical effect concept: time manipulation spell in action, clock fragments orbiting caster, past and future versions visible as ghostly echoes, temporal distortion waves | Style: Dynamic | Enhancement: High Detail", category: "abstract" },
      { text: "Cinematic game scene: dragon siege on medieval castle, fire raining from above, defenders on walls with ballistas, epic battle scale, smoke and chaos | Style: Cinematic | Enhancement: High Detail", category: "cinematic" },
      { text: "Story moment: lone wanderer discovering massive ancient mech half-buried in desert sand, scale contrast between human and machine, mysterious glowing core still active | Style: Cinematic | Enhancement: High Detail", category: "cinematic" },
      { text: "Cutscene concept: underwater temple entrance revealed as ocean parts, coral-encrusted pillars, schools of fish scattering, divine light from within, epic discovery | Style: Dynamic | Enhancement: High Detail", category: "cinematic" },
      { text: "Boss arena concept: volcanic throne room, obsidian pillars, lava channels forming geometric patterns on floor, smoke and embers, ominous red lighting, epic scale | Style: Cinematic | Enhancement: High Detail", category: "cinematic" },
    ],
  },
];

export function getModelPageBySlug(slug: string): ModelPageData | undefined {
  return MODEL_PAGES.find((p) => p.slug === slug);
}
