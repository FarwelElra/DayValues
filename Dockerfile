# Verwende ein offizielles OpenJDK-Basisimage
FROM openjdk:17-jdk-slim

CMD ["mkdir", "/app"]
# Setze das Arbeitsverzeichnis im Container
WORKDIR /app

# Kopiere die JAR-Datei in das Arbeitsverzeichnis
COPY build/libs/demo-DayValues.war DayValues.war
EXPOSE 8080
# Definiere den Befehl, der beim Start des Containers ausgeführt wird
CMD ["java", "-jar", "DayValues.war"]