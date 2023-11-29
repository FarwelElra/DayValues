# Verwende ein offizielles OpenJDK-Basisimage
FROM openjdk:17-jre-slim

# Setze das Arbeitsverzeichnis im Container
WORKDIR /app

# Kopiere die JAR-Datei in das Arbeitsverzeichnis
COPY /build/libs/ /app/your-spring-boot-app.jar

# Definiere den Befehl, der beim Start des Containers ausgeführt wird
CMD ["java", "-jar", "your-spring-boot-app.jar"]