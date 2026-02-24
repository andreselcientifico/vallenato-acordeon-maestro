import sharp from "sharp";
import { readdirSync, existsSync, mkdirSync, statSync } from "fs";
import { join } from "path";

const sizes = [
  { suffix: "small", width: 400 },
  { suffix: "medium", width: 750 },
  { suffix: "large", width: 1200 },
];

const outputBaseDir = "./src/assets";
if (!existsSync(outputBaseDir)) mkdirSync(outputBaseDir, { recursive: true });

// Definir todas las ubicaciones de imágenes
const imageDirectories = [
  { path: "./src/assets", label: "Source Assets" },
  { path: "./src/assets/photos", label: "Source Photos" },
];

const processImages = async (dir, label) => {
  if (!existsSync(dir)) {
    console.log(`⚠️  ${dir} no existe, saltando...`);
    return;
  }

  const files = readdirSync(dir).filter((file) => {
    const filePath = join(dir, file);
    if (!statSync(filePath).isFile()) return false;
    if (!/\.(webp|jpg|jpeg|png)$/i.test(file)) return false;
    if (
      file.includes("-small") ||
      file.includes("-medium") ||
      file.includes("-large")
    )
      return false;
    // Tratar logos y hero por separado para mayor control, pero el proceso general también sirve
    if (file.includes("vallenato-logo") || file.includes("hero-background"))
      return false;
    return true;
  });

  if (files.length === 0) {
    console.log(`  ℹ️  No hay imágenes para procesar`);
    return;
  }

  console.log(`  📁 Procesando ${files.length} archivos de ${label}...`);

  for (const file of files) {
    const inputPath = join(dir, file);
    const nameWithoutExt = file.replace(/\.[^/.]+$/, "");

    // Mantener la estructura de subdirectorios en public/assets si vienen de src/assets/photos
    let outputDir = outputBaseDir;
    if (dir.includes("photos")) {
      outputDir = join(outputBaseDir, "photos");
      if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });
    }

    try {
      const metadata = await sharp(inputPath).metadata();
      console.log(`\n  🖼️  ${file} (${metadata.width}x${metadata.height})`);

      await Promise.all(
        sizes.map(async ({ suffix, width }) => {
          const outputPath = join(
            outputDir,
            `${nameWithoutExt}-${suffix}.webp`,
          );

          await sharp(inputPath)
            .resize(width, null, {
              fit: "inside",
              withoutEnlargement: true,
            })
            .webp({ quality: 80, effort: 6 })
            .toFile(outputPath);

          console.log(`    ✓ ${suffix} generado en ${outputDir}`);
        }),
      );
    } catch (error) {
      console.error(`    ✗ Error: ${error.message}`);
    }
  }
};

const optimizeLogosAndIcons = async () => {
  console.log("\n🎨 Optimizando logos:");

  const logoPath = "./src/assets/vallenato-logo.webp";
  if (!existsSync(logoPath)) {
    console.log("  ⚠️  Logo no encontrado en src/assets");
    return;
  }

  const logoSizes = [
    { suffix: "small", width: 48 },
    { suffix: "medium", width: 96 },
    { suffix: "large", width: 192 },
  ];

  for (const { suffix, width } of logoSizes) {
    const outputPath = join(outputBaseDir, `vallenato-logo-${suffix}.webp`);
    try {
      await sharp(logoPath)
        .resize(width, width)
        .webp({ quality: 90, effort: 6 })
        .toFile(outputPath);
      console.log(`  ✓ ${suffix} (${width}px) generado`);
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
    }
  }
};

const optimizeHeroBackground = async () => {
  console.log("\n🖼️  Optimizando hero background:");

  const heroPath = "./src/assets/hero-background.webp";
  if (!existsSync(heroPath)) {
    console.log("  ⚠️  Hero background no encontrado en src/assets");
    return;
  }

  const heroSizes = [
    { suffix: "small", width: 640 },
    { suffix: "medium", width: 1280 },
    { suffix: "large", width: 1920 },
  ];

  for (const { suffix, width } of heroSizes) {
    const outputPath = join(outputBaseDir, `hero-background-${suffix}.webp`);
    try {
      await sharp(heroPath)
        .resize(width, null, { fit: "cover" })
        .webp({ quality: 85, effort: 6 })
        .toFile(outputPath);
      console.log(`  ✓ ${suffix} (${width}px) generado`);
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
    }
  }
};

// Resumen de directorios
const showDirectoryStructure = () => {
  console.log("📂 Estructura de directorios a procesar:\n");

  imageDirectories.forEach(({ path, label }) => {
    if (existsSync(path)) {
      const files = readdirSync(path).filter(
        (f) =>
          /\.(webp|jpg|jpeg|png)$/i.test(f) && statSync(join(path, f)).isFile(),
      );
      console.log(`  ✓ ${label} (${path}): ${files.length} archivos`);
    } else {
      console.log(`  ✗ ${label} (${path}): no existe`);
    }
  });
  console.log("");
};

// Ejecutar todo
(async () => {
  console.log("🚀 Iniciando optimización de imágenes...\n");
  console.log("=".repeat(50));

  showDirectoryStructure();

  console.log("=".repeat(50));

  for (const { path, label } of imageDirectories) {
    console.log(`\n📸 ${label} (${path}):`);
    await processImages(path, label);
  }

  await optimizeLogosAndIcons();
  await optimizeHeroBackground();

  console.log("\n" + "=".repeat(50));
  console.log("✨ ¡Optimización completada!\n");
})();
