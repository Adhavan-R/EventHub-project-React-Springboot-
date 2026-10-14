
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
COPY src src

RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# Verify the configuration is packaged
RUN ls -la /app/src/main/resources && \
    find /app/target -maxdepth 2 -name '*.jar' -print && \
    jar tf /app/target/eventhub-backend-0.0.1-SNAPSHOT.jar | head -40

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
