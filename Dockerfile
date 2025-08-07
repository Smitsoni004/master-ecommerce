# Build stage
FROM eclipse-temurin:17-jdk as builder

WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY src ./src

# Build the application
RUN chmod +x ./mvnw || true
RUN ./mvnw clean package -DskipTests || mvn clean package -DskipTests

# Runtime stage  
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /app/target/master-ecommerce-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
